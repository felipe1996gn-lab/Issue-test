# Debug script para probar endpoints

import requests
import json

NGROK_URL = 'TU_URL_DE_NGROK_AQUI'  # Reemplaza por tu URL pública de ngrok
PROJECT = 'testproject'

# 1. Crear un issue
resp = requests.post(f'{NGROK_URL}/api/issues/{PROJECT}', data={
    'issue_title': 'Test',
    'issue_text': 'Texto de prueba',
    'created_by': 'Copilot',
    'assigned_to': 'Felipe',
    'status_text': 'Pendiente'
})
print('POST:', resp.status_code, resp.json())
issue_id = resp.json().get('_id')

# 2. Obtener todos los issues
resp = requests.get(f'{NGROK_URL}/api/issues/{PROJECT}')
print('GET:', resp.status_code, resp.json())

# 3. Filtrar por open=false
resp = requests.get(f'{NGROK_URL}/api/issues/{PROJECT}?open=false')
print('GET con filtro:', resp.status_code, resp.json())

# 4. Actualizar el issue
if issue_id:
    resp = requests.put(f'{NGROK_URL}/api/issues/{PROJECT}', data={
        '_id': issue_id,
        'issue_title': 'Actualizado',
        'open': 'false'
    })
    print('PUT:', resp.status_code, resp.json())

# 5. Obtener el issue actualizado
resp = requests.get(f'{NGROK_URL}/api/issues/{PROJECT}')
print('GET después de PUT:', resp.status_code, resp.json())
