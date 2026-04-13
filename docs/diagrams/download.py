import os
import re
from plantuml import PlantUML

directory = r'c:\Users\manhpc\Documents\python project\ticket-booking\docs\diagrams'
puml = PlantUML(url='http://www.plantuml.com/plantuml/png/')

for filename in os.listdir(directory):
    if filename.endswith('.md'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        match = re.search(r'(@start(?:uml|wbs).*?@end(?:uml|wbs))', content, re.DOTALL)
        if match:
            puml_code = match.group(1)
            out_name = filename.replace('.md', '.png')
            out_path = os.path.join(directory, out_name)
            temp_puml = os.path.join(directory, 'temp.puml')
            with open(temp_puml, 'w', encoding='utf-8') as f:
                f.write(puml_code)
            try:
                puml.processes_file(temp_puml, outfile=out_path)
                print(f'Downloaded {out_name}')
            except Exception as e:
                print(str(e))
            if os.path.exists(temp_puml):
                os.remove(temp_puml)
