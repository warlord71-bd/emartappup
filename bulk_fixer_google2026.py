
import requests
from requests.auth import HTTPBasicAuth
import time
import json
import re
import os
import hashlib

WC_URL = "https://e-mart.com.bd"
WC_KEY = "ck_9d9fabaffcc52af85797a6887feb5a8da730b51f"
WC_SECRET = "cs_2551608b6d9f84841f8193eaffff2bfb120e659b"
OR_KEY = "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"
TG_TOKEN = "8705011508:AAGjcEGOjQ7inSa-chq9sJswEOo8XcJ9KXE"
TG_CHAT = "6906852635"

auth = HTTPBasicAuth(WC_KEY, WC_SECRET)
BATCH_SIZE = 20
SCORE_THRESHOLD = 50
PROGRESS_FILE = "/tmp/bulk_fixer_progress.json"
DESC_CACHE_FILE = "/tmp/desc_cache.json"

AI_RESIDUE = [
    "certainly", "absolutely", "furthermore", "moreover", "leverage",
    "comprehensive", "game-changer", "in conclusion", "in summary",
    "it's worth noting", "delve into", "tapestry", "vibrant", "bustling",
    "revolutionize", "groundbreaking", "cutting-edge", "state-of-the-art",
    "seamlessly", "robust", "paradigm", "synergy", "stakeholder",
    "i'd be happy to", "as an ai", "please note that"
]

def tg(msg):
    try:
        requests.post(f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            json={"chat_id": TG_CHAT, "text": msg[:4000]}, timeout=10)
    except: pass

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {"done_ids": [], "failed_ids": [], "revenue_scored": False}

def save_progress(p):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(p, f)

def remove_ai_residue(text):
    for phrase in AI_RESIDUE:
        text = re.sub(re.escape(phrase), "", text, flags=re.IGNORECASE)
    text = re.sub(r'  +', ' ', text)
    return text.strip()

def get_content_hash(name, brand, cats):
    key = f"{name}_{brand}_{cats}"
    return hashlib.md5(key.encode()).hexdigest()[:8]

def score_description(desc):
    if not desc or len(desc.strip()) < 50:
        return 0
    score = 0
    text = re.sub('<[^<]+?>', '', desc).lower()
    word_count = len(text.split())
    if word_count >= 300: score += 25
    elif word_count >= 150: score += 15
    elif word_count >= 80: score += 8
    bd_kw = ['bangladesh', 'dhaka', 'emart', 'e-mart', 'authentic',
             'অথেনটিক', 'বাংলাদেশ', 'ঢাকা', 'cod', 'delivery']
    score += min(20, sum(3 for k in bd_kw if k in text))
    bangla = len(re.findall(r'[\u0980-\u09FF]', desc))
    if bangla > 200: score += 15
    elif bangla > 100: score += 10
    elif bangla > 30: score += 5
    if '<h3' in desc or '<h2' in desc: score += 8
    if '<p>' in desc or '<p ' in desc: score += 7
    if 'faq' in text or 'প্রশ্ন' in text: score += 5
    info_kw = ['ingredient', 'how to use', 'ব্যবহার', 'উপাদান', 'skin type']
    score += min(20, sum(3 for k in info_kw if k in text))
    return min(100, score)
