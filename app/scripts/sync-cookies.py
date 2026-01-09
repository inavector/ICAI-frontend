#!/usr/bin/env python3
import os
import sys
import json
import sqlite3
import shutil
import tempfile
import platform
import subprocess
import base64
import hashlib
from pathlib import Path

def install_package(package):
    import site
    import importlib
    user_site = site.getusersitepackages()
    if user_site and user_site not in sys.path:
        sys.path.insert(0, user_site)
    try:
        subprocess.check_call(
            [sys.executable, '-m', 'pip', 'install', '--quiet', '--user', '--disable-pip-version-check', package],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        importlib.invalidate_caches()
        return True
    except:
        try:
            subprocess.check_call(
                [sys.executable, '-m', 'pip', 'install', '--quiet', '--disable-pip-version-check', package],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            importlib.invalidate_caches()
            return True
        except:
            return False

try:
    from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
    from cryptography.hazmat.backends import default_backend
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    CRYPTO_AVAILABLE = True
except ImportError:
    if install_package('cryptography'):
        import importlib
        importlib.invalidate_caches()
        try:
            from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
            from cryptography.hazmat.backends import default_backend
            from cryptography.hazmat.primitives import hashes
            from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
            CRYPTO_AVAILABLE = True
        except ImportError:
            CRYPTO_AVAILABLE = False
    else:
        CRYPTO_AVAILABLE = False

def find_chrome_profiles():
    profiles = []
    home = Path.home()
    
    if platform.system() == 'Windows':
        chrome_base = home / 'AppData' / 'Local' / 'Google' / 'Chrome' / 'User Data'
    elif platform.system() == 'Darwin':
        chrome_base = home / 'Library' / 'Application Support' / 'Google' / 'Chrome'
    elif platform.system() == 'Linux':
        chrome_base = home / '.config' / 'google-chrome'
    else:
        return profiles
    
    if not chrome_base.exists():
        return profiles
    
    local_state_path = chrome_base / 'Local State'
    profile_info = {}
    
    if local_state_path.exists():
        try:
            with open(local_state_path, 'r', encoding='utf-8') as f:
                local_state = json.load(f)
                if 'profile' in local_state and 'info_cache' in local_state['profile']:
                    profile_info = local_state['profile']['info_cache']
        except:
            pass
    
    def get_profile_info(profile_dir):
        profile_key = next((k for k in profile_info.keys() if k == profile_dir or profile_dir in k or k.endswith(profile_dir)), None)
        profile_data = profile_info.get(profile_key, profile_info.get(profile_dir, {}))
        
        prefs_path = chrome_base / profile_dir / 'Preferences'
        if prefs_path.exists():
            try:
                with open(prefs_path, 'r', encoding='utf-8') as f:
                    preferences = json.load(f)
                    if 'account_info' in preferences and preferences['account_info']:
                        profile_data['email'] = preferences['account_info'][0].get('email', profile_data.get('user_name', ''))
                        profile_data['name'] = preferences['account_info'][0].get('given_name', profile_data.get('name', profile_dir))
                    elif 'profile' in preferences and 'name' in preferences['profile']:
                        profile_data['name'] = preferences['profile']['name']
            except:
                pass
        
        return {
            'name': profile_data.get('name', profile_dir),
            'email': profile_data.get('user_name', profile_data.get('email', '')),
        }
    
    default_cookies = chrome_base / 'Default' / 'Cookies'
    if default_cookies.exists():
        info = get_profile_info('Default')
        profiles.append({
            'name': info['name'],
            'email': info['email'],
            'path': str(default_cookies),
            'profileDir': 'Default',
        })
    
    for i in range(1, 11):
        profile_dir = f'Profile {i}'
        cookies_path = chrome_base / profile_dir / 'Cookies'
        if cookies_path.exists():
            info = get_profile_info(profile_dir)
            profiles.append({
                'name': info['name'],
                'email': info['email'],
                'path': str(cookies_path),
                'profileDir': profile_dir,
            })
    
    try:
        for entry in chrome_base.iterdir():
            if entry.is_dir() and (entry.name.startswith('Profile ') or entry.name == 'Default'):
                cookies_path = entry / 'Cookies'
                if cookies_path.exists() and not any(p['path'] == str(cookies_path) for p in profiles):
                    info = get_profile_info(entry.name)
                    profiles.append({
                        'name': info['name'],
                        'email': info['email'],
                        'path': str(cookies_path),
                        'profileDir': entry.name,
                    })
    except:
        pass
    
    return profiles

def decrypt_cookie_windows(encrypted_value):
    if platform.system() != 'Windows':
        return ''
    
    try:
        base64_data = base64.b64encode(encrypted_value).decode('utf-8')
        ps_script = f'''
Add-Type -AssemblyName System.Security
$encryptedBytes = [Convert]::FromBase64String('{base64_data}')
try {{
    $decryptedBytes = [System.Security.Cryptography.ProtectedData]::Unprotect(
        $encryptedBytes,
        $null,
        [System.Security.Cryptography.DataProtectionScope]::CurrentUser
    )
    $decryptedString = [System.Text.Encoding]::UTF8.GetString($decryptedBytes)
    Write-Output $decryptedString
}} catch {{
    Write-Output ""
}}
'''.strip().replace('\n', ' ')
        
        result = subprocess.run(
            ['powershell', '-NoProfile', '-NonInteractive', '-Command', ps_script],
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.stdout.strip() if result.returncode == 0 else ''
    except:
        return ''

def get_chrome_encryption_keys():
    salt = b'saltysalt'
    iterations = 1003
    key_length = 16
    keys = []
    
    default_passwords = [b'', b'peanuts', b'chromium', b'chrome', b'safe', b'password']
    for pwd in default_passwords:
        try:
            if CRYPTO_AVAILABLE:
                kdf = PBKDF2HMAC(
                    algorithm=hashes.SHA1(),
                    length=key_length,
                    salt=salt,
                    iterations=iterations,
                    backend=default_backend()
                )
                key = kdf.derive(pwd)
            else:
                key = hashlib.pbkdf2_hmac('sha1', pwd, salt, iterations, key_length)
            if key not in keys:
                keys.append(key)
        except:
            continue
    
    if platform.system() == 'Darwin':
        try:
            result = subprocess.run(
                ['security', 'find-generic-password', '-w', '-s', 'Chrome Safe Storage', '-a', 'Chrome'],
                capture_output=True,
                text=True,
                timeout=5
            )
            keychain_password = result.stdout.strip()
            if keychain_password and 'could not be found' not in keychain_password and 'error' not in keychain_password.lower():
                if CRYPTO_AVAILABLE:
                    kdf = PBKDF2HMAC(
                        algorithm=hashes.SHA1(),
                        length=key_length,
                        salt=salt,
                        iterations=iterations,
                        backend=default_backend()
                    )
                    key = kdf.derive(keychain_password.encode('utf-8'))
                else:
                    key = hashlib.pbkdf2_hmac('sha1', keychain_password.encode('utf-8'), salt, iterations, key_length)
                if key not in keys:
                    keys.insert(0, key)
        except:
            pass
    
    return keys

def decrypt_cookie_value(encrypted_value, encryption_keys):
    if not encrypted_value or len(encrypted_value) == 0:
        return ''
    
    if platform.system() == 'Windows':
        decrypted = decrypt_cookie_windows(encrypted_value)
        if decrypted:
            return decrypted
    
    if len(encrypted_value) < 3:
        return ''
    
    prefix_bytes = encrypted_value[:3]
    if prefix_bytes != b'v10':
        return ''
    
    if len(encrypted_value) < 19:
        return ''
    
    iv = encrypted_value[3:19]
    ciphertext = encrypted_value[19:]
    
    if len(ciphertext) == 0:
        return ''
    
    for encryption_key in encryption_keys:
        try:
            if not CRYPTO_AVAILABLE:
                continue
            cipher = Cipher(algorithms.AES(encryption_key), modes.CBC(iv), backend=default_backend())
            decryptor = cipher.decryptor()
            decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()
            
            if len(decrypted_padded) == 0:
                continue
            
            padding_len = decrypted_padded[-1]
            if padding_len > 0 and padding_len <= 16 and padding_len <= len(decrypted_padded):
                try:
                    if all(decrypted_padded[-i] == padding_len for i in range(1, padding_len + 1)):
                        decrypted = decrypted_padded[:-padding_len]
                    else:
                        decrypted = decrypted_padded
                except:
                    decrypted = decrypted_padded
            else:
                decrypted = decrypted_padded
            
            result = decrypted.decode('utf-8', errors='ignore')
            if result and len(result) > 0:
                return result
        except (ValueError, UnicodeDecodeError):
            continue
        except Exception:
            continue
    
    return ''

def extract_instagram_cookies():
    profiles = find_chrome_profiles()
    
    if not profiles:
        print('No Chrome profiles found')
        return
    
    print(f'Found {len(profiles)} Chrome profile(s):\n')
    for i, profile in enumerate(profiles, 1):
        email_str = f" ({profile['email']})" if profile['email'] else ''
        print(f"  {i}. {profile['name']}{email_str} - {profile['profileDir']}")
    print()
    
    all_cookies = []
    found_profile = None
    
    for profile in profiles:
        email_str = f" ({profile['email']})" if profile['email'] else ''
        print(f"Checking profile: {profile['name']}{email_str}...")
        
        temp_db = tempfile.NamedTemporaryFile(delete=False, suffix='.db')
        temp_db.close()
        
        try:
            shutil.copy2(profile['path'], temp_db.name)
        except:
            continue
        
        try:
            conn = sqlite3.connect(temp_db.name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT 
                    name,
                    value,
                    encrypted_value,
                    host_key as domain,
                    path,
                    expires_utc,
                    is_secure,
                    is_httponly,
                    samesite,
                    creation_utc,
                    last_access_utc
                FROM cookies
                WHERE host_key LIKE '%instagram.com%' 
                   OR host_key LIKE '%.instagram.com%'
                   OR host_key = 'instagram.com'
                ORDER BY host_key, name
            ''')
            
            db_cookies = cursor.fetchall()
            conn.close()
            
            if db_cookies:
                email_str = f" ({profile['email']})" if profile['email'] else ''
                print(f"Found {len(db_cookies)} Instagram cookies in profile: {profile['name']}{email_str}")
                found_profile = profile
                
                encryption_keys = get_chrome_encryption_keys()
                if platform.system() == 'Darwin':
                    print(f"Using {len(encryption_keys)} encryption key(s) for decryption")
                
                encrypted_count = 0
                failed_count = 0
                decrypted_count = 0
                
                for cookie in db_cookies:
                    cookie_value = ''
                    was_encrypted = False
                    
                    encrypted_value = cookie[2] if cookie[2] else None
                    if encrypted_value and not isinstance(encrypted_value, bytes):
                        encrypted_value = bytes(encrypted_value)
                    
                    if encrypted_value and len(encrypted_value) > 0:
                        was_encrypted = True
                        encrypted_count += 1
                        cookie_value = decrypt_cookie_value(encrypted_value, encryption_keys)
                        if cookie_value:
                            decrypted_count += 1
                        else:
                            failed_count += 1
                    
                    if not cookie_value and cookie[1]:
                        cookie_value = cookie[1]
                        if not was_encrypted:
                            decrypted_count += 1
                    
                    expires_utc = cookie[5]
                    expires = None
                    if expires_utc:
                        expires_ts = (expires_utc / 1000000) - 11644473600000
                        if expires_ts > 0:
                            expires = __import__('datetime').datetime.fromtimestamp(expires_ts / 1000, tz=__import__('datetime').timezone.utc)
                    
                    creation_utc = cookie[9]
                    created_at = None
                    if creation_utc:
                        created_ts = (creation_utc / 1000000) - 11644473600000
                        if created_ts > 0:
                            created_at = __import__('datetime').datetime.fromtimestamp(created_ts / 1000, tz=__import__('datetime').timezone.utc)
                    
                    last_access_utc = cookie[10]
                    last_accessed = None
                    if last_access_utc:
                        accessed_ts = (last_access_utc / 1000000) - 11644473600000
                        if accessed_ts > 0:
                            last_accessed = __import__('datetime').datetime.fromtimestamp(accessed_ts / 1000, tz=__import__('datetime').timezone.utc)
                    
                    same_site_map = {-1: 'None', 1: 'Lax', 2: 'Strict'}
                    same_site = same_site_map.get(cookie[8], 'None')
                    
                    all_cookies.append({
                        'name': cookie[0],
                        'value': cookie_value,
                        'domain': cookie[3],
                        'path': cookie[4],
                        'secure': bool(cookie[6]),
                        'httpOnly': bool(cookie[7]),
                        'sameSite': same_site,
                        'expires': expires.isoformat() + 'Z' if expires else None,
                        'createdAt': created_at.isoformat() + 'Z' if created_at else None,
                        'lastAccessed': last_accessed.isoformat() + 'Z' if last_accessed else None,
                    })
                
                break
        finally:
            try:
                os.unlink(temp_db.name)
            except:
                pass
    
    if not all_cookies:
        print('No Instagram cookies found in any profile.')
        print('Make sure you are logged into Instagram in Chrome.')
        return
    
    decrypted_count = sum(1 for c in all_cookies if c['value'])
    encrypted_count = len(all_cookies) - decrypted_count
    failed_count = sum(1 for c in all_cookies if not c['value'])
    
    timestamp = __import__('datetime').datetime.now().isoformat().replace(':', '-').replace('.', '-')
    filename = f'instagram-cookies-{timestamp}.json'
    filepath = Path(__file__).parent.parent / filename
    
    output = {
        'timestamp': __import__('datetime').datetime.now().isoformat() + 'Z',
        'profile': {
            'name': found_profile['name'],
            'email': found_profile['email'],
            'profileDir': found_profile['profileDir'],
        },
        'cookies': all_cookies,
        'statistics': {
            'totalCookies': len(all_cookies),
            'decryptedCount': decrypted_count,
            'encryptedCount': encrypted_count,
            'failedCount': failed_count,
        },
    }
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    email_str = f" ({found_profile['email']})" if found_profile['email'] else ''
    print(f'\nExtracted {len(all_cookies)} Instagram cookies')
    print(f"Profile: {found_profile['name']}{email_str}")
    print(f'Decrypted: {decrypted_count}, Encrypted: {encrypted_count}, Failed: {failed_count}')
    print(f'Saved to: {filepath}\n')
    
    print('Instagram Cookies:')
    for cookie in all_cookies:
        value_preview = cookie['value'][:50] + '...' if cookie['value'] and len(cookie['value']) > 50 else (cookie['value'] if cookie['value'] else '(empty)')
        print(f"  {cookie['name']}: {value_preview}")

if __name__ == '__main__':
    if not CRYPTO_AVAILABLE:
        print('Warning: cryptography library not available. Encrypted cookies cannot be decrypted.')
        print('Install with: pip install cryptography')
    try:
        extract_instagram_cookies()
    except KeyboardInterrupt:
        print('\nCancelled')
        sys.exit(0)
    except Exception as e:
        print(f'Error: {e}')
        sys.exit(1)

