from dotenv import load_dotenv
import os
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

print(f"URL found: {'Yes' if url else 'No'}")
print(f"KEY found: {'Yes' if key else 'No'}")

if not url or not key:
    print("ERROR: Missing SUPABASE_URL or SUPABASE_KEY in .env file")
    exit(1)

try:
    print(f"Connecting to {url}...")
    supabase = create_client(url, key)
    
    # Try simple select first (public access usually allowed if RLS off)
    # But insert is the real test
    print("Attempting to insert test user...")
    data = {"age": 99, "gender": "CHECK_DB_TEST", "location": "Test", "income": 0, "lifestyle_factors": "test"}
    res = supabase.table("users").insert(data).execute()
    print("\nSUCCESS! Data inserted.")
    print("Response:", res.data)
except Exception as e:
    print("\nFAILURE!")
    print(f"Error details: {e}")
