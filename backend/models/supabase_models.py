from typing import Dict, List
import os
import uuid
from supabase import create_client, Client
from config import Config

class SupabaseModels:
    def __init__(self):
        url = Config.SUPABASE_URL
        key = Config.SUPABASE_KEY
        if url and key:
            self.supabase: Client = create_client(url, key)
        else:
            self.supabase = None
            print("Warning: Supabase credentials not found. DB operations will be bypassed.")

    def create_user(self, user_data: Dict) -> Dict:
        if not self.supabase: return {**user_data, "id": "mock-user-id"}
        try:
            # Generate UUID in Python to be safe
            user_id = str(uuid.uuid4())
            data = {**user_data, "id": user_id}
            
            response = self.supabase.table('users').insert(data).execute()
            if response.data:
                return response.data[0]
            return data # Return the data we sent if response is empty (but successful)
        except Exception as e:
            print(f"DB Error (create_user): {e}")
            # RETHROW exception so we know it failed
            raise e

    def create_policy(self, user_id: str, insurance_details: Dict) -> Dict:
        policy_id = str(uuid.uuid4())
        policy_data = {
            "id": policy_id,
            "user_id": user_id,
            "type": insurance_details.get('type'),
            "coverage_amount": insurance_details.get('coverage_amount'),
            "duration": insurance_details.get('duration'), # Added duration
            "status": "active"
        }
        if not self.supabase: return {**policy_data, "id": "mock-policy-id"}
        
        try:
            response = self.supabase.table('policies').insert(policy_data).execute()
            if response.data:
                return response.data[0]
            return policy_data
        except Exception as e:
            print(f"DB Error (create_policy): {e}")
            raise e

    def save_risk_assessment(self, policy_id: str, risk_data: Dict) -> Dict:
        if not self.supabase: return risk_data
        try:
            data = {
                "policy_id": policy_id,
                "score": risk_data.get('score'),
                "score_value": float(risk_data.get('score_value', 0)),
                "factors": risk_data.get('factors'),
                "explanation": risk_data.get('explanation')
            }
            self.supabase.table('risk_assessments').insert(data).execute()
            return risk_data
        except Exception as e:
            print(f"DB Error (save_risk_assessment): {e}")
            return risk_data

    def save_pricing(self, policy_id: str, pricing_data: Dict) -> Dict:
        if not self.supabase: return pricing_data
        try:
            data = {
                "policy_id": policy_id,
                "monthly_premium": pricing_data.get('monthly_premium'),
                "yearly_premium": pricing_data.get('yearly_premium'),
                "breakdown": pricing_data.get('breakdown'),
                "explanation": pricing_data.get('explanation')
            }
            self.supabase.table('pricing_details').insert(data).execute()
            return pricing_data
        except Exception as e:
            print(f"DB Error (save_pricing): {e}")
            return pricing_data

    def save_policy_version(self, policy_id: str, policy_text: str, version_note: str = "Update") -> Dict:
        data = {
            "policy_id": policy_id, 
            "policy_text": policy_text,
            "version_note": version_note
        }
        if not self.supabase: return data
        try:
            self.supabase.table('policy_versions').insert(data).execute()
            return data
        except Exception as e:
            print(f"DB Error (save_policy_version): {e}")
            return data

    def log_prompt(self, policy_id: str, prompt_text: str) -> Dict:
        data = {"policy_id": policy_id, "prompt_text": prompt_text}
        if not self.supabase: return data
        try:
            self.supabase.table('prompts_log').insert(data).execute()
            return data
        except Exception as e:
            print(f"DB Error (log_prompt): {e}")
            return data
