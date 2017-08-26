import secrets, etcd, redis
import hashlib, binascii

e = etcd.Client(host='0.0.0.0', port=2379)

def new_session(r):
    session = randint(100000, 999999)
    while r.exists(session) == 1:
        session = randint(100000, 999999)
    r.hset(session, "time", str(datetime.datetime.now()))
    return session

def generate_new_user(name, passw):
    if check_user_exists(name):
        return "ERROR: User Already Exists"
    salt = newsalt()
    key = hashlib.pbkdf2_hmac('sha256', passw.encode(), salt.encode(), 10000)
    e.write(name + "/salt", salt)
    e.write(name + "/key", binascii.hexlify(key))
    return "Created new user " + name

def newsalt(size=32):
    return secrets.token_hex(size)

def check_user_exists(name):
    try:
        e.read(name + "/salt")
        return True
    except etcd.EtcdKeyNotFound:
        return False

def validate(name, passw):
    if check_user_exists(name) == False:
        return "ERROR: No Such User"
    salt = e.read(name + "/salt").value
    key = hashlib.pbkdf2_hmac('sha256', passw.encode(), salt.encode(), 10000)
    return e.read(name + "/key").value == binascii.hexlify(key).decode()
