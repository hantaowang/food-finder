from Crypto.Hash import SHA256
import secrets, etcd, json

e =  etcd.Client(host='0.0.0.0', port=2379)

def generate_new_user(name):
    if check_user_exists(name) == False:
        return "ERROR: User Already Exists"
    salt1 = newsalt()
    e.write(name + "/salt1", salt1)
    return salt1   

def get_user_salt(name):
    if check_user_exists(name) == False:
        return "ERROR: No Such User"
    return e.read(name + "/salt1")

def update_user_key(name, key1):
    if check_user_exists(name) == False:
        return "ERROR: No Such User"
    hash = SHA256.new()
    salt = newsalt()
    hash.update(salt + key1)
    key2 = hash.digest()
    e.write(name + "/key", key2)
    e.write(name + "/salt2", salt2) 

def newsalt(size=32):
    return secrets.token_hex(size)

def check_user_exists(name):
    try:
        e.read(name + "/salt1")
        return True
    except etcd.EtcdKeyNotFound:
        return False

def validate(name, key):
    if check_user_exists(name) == False:
        return "ERROR: No Such User"
    hash = SHA256.new()
    hash.update(e.read(name + "/salt2") + key1)
    key2 = hash.digest()
    return e.read(name + "/key") == key2




