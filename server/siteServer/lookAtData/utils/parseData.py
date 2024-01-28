import sqlite3
import json

db_path = '../../db.sqlite3'  # Replace with your actual database file path
output_json_path = '../../user_activity_results.json'

class UserActivityAnalyzer:
    def __init__(self, db_path):
        self.db_path = db_path
        self.conn = sqlite3.connect(self.db_path)
        self.cursor = self.conn.cursor()

    def calculate_frequencies(self):
        query = """
        SELECT webType, COUNT(*) as frequency
        FROM lookAtData_useractions
        GROUP BY webType;
        """
        self.cursor.execute(query)
        return dict(self.cursor.fetchall())

    def calculate_total_times(self):
        query = """
        SELECT webType, SUM(activeTime) as total_time
        FROM lookAtData_useractions
        GROUP BY webType;
        """
        self.cursor.execute(query)
        return dict(self.cursor.fetchall())

    def calculate_average_time(self):
        query = """
        SELECT webType, AVG(activeTime) as average_time
        FROM lookAtData_useractions
        GROUP BY webType;
        """
        self.cursor.execute(query)
        return dict(self.cursor.fetchall())


    def save_results_to_json(self, output_path):
        results = {
            "visiting_frequencies": self.calculate_frequencies(),
            "total_active_time": self.calculate_total_times(),
            "average_staying_time": self.calculate_average_time()
        }
        with open(output_path, 'w') as json_file:
            json.dump(results, json_file, indent=4)

    def close_connection(self):
        self.cursor.close()
        self.conn.close()


#analyzer = UserActivityAnalyzer(db_path)
#analyzer.save_results_to_json(output_json_path)
#analyzer.close_connection()