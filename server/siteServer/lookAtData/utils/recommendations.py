import json
import requests

class UserActivityLLMAnalyzer:
    def __init__(self, json_file_path):
        self.json_file_path = json_file_path

    def read_activity_data(self):
        with open(self.json_file_path, 'r') as file:
            data = json.load(file)
        return data

    def generate_llm_query(self):
        data = self.read_activity_data()
        visiting_frequencies = data['visiting_frequencies']
        total_active_time = data['total_active_time']
        average_staying_time = data['average_staying_time']

        prompt = "<s>[INST]Based on the user's browsing data, we have the following activity summary:\n\n"
        for category, frequency in visiting_frequencies.items():
            prompt += f"- Category '{category}' was visited {frequency} times, with a total active time of {total_active_time[category]} minutes and an average staying time of {average_staying_time[category]} minutes per visit.\n"
        
        prompt += "\nConsidering this data, should we recommend any attention redirection to the user? If so, what kind of advice would you give?[INST]"
        
        return prompt

    def ask_llm_for_decision(self, llm_endpoint="http://127.0.0.1:8999/v1/completions"):
        query = self.generate_llm_query()
        print(query)
        data = {
            "prompt": query,
            "temperature": 0.7,
            "max_tokens": 100,
            "stop": "\n"
        }
        response = requests.post(llm_endpoint, json=data)
        response_data = response.json()
        recommendation = response_data.get('choices', [{}])[0].get('text', '').strip()
        return recommendation

    def make_decision_and_save(self, output_path):
        recommendation = self.ask_llm_for_decision()
        results = {
            "recommendation": recommendation
        }
        self.save_results_to_json(output_path, results)

    def save_results_to_json(self, output_path, results):
        with open(output_path, 'w') as json_file:
            json.dump(results, json_file, indent=4)

# Test section (main)
if __name__ == "__main__":
    json_file_path = '../../user_activity_results.json'  # Update this path
    output_json_path = '../../recommendation_results.json'  # Update this path
    
    analyzer = UserActivityLLMAnalyzer(json_file_path)
    analyzer.make_decision_and_save(output_json_path)
    print(f"Analysis and recommendation saved to {output_json_path}")
