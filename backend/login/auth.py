from Crypto.Hash import SHA256
import secrets

database = {}

def generate_new_user(name):
    if name in database:
        return "[ERROR] User Already Exists"
    salt1 = newsalt()
    salt2 = newsalt()
    database[name] = {"salt1": salt1, "salt2": salt2, "key": None}     
    return salt1   

def get_user_salt(name):
    if name in database:
        return database[name]["salt1"]
    else:
        return newsalt()

def update_user_key(name, key1):
    hash = SHA256.new()
    hash.update(database[name]['salt2'] + key1)
    key2 = hash.digest()
    database[name]["key"] = key2

def newsalt(size=32):
    return secrets.token_hex(size)

def validate(name, key):
    hash = SHA256.new()
    hash.update(database[name]['salt2'] + key1)
    key2 = hash.digest()
    return database[name]["key"] == key2




