#!/usr/bin/env python3
"""
Script para inicializar la base de datos SQLite.
Ejecutar este script antes de iniciar el backend por primera vez.

Uso:
    python setup_database.py
"""

import sys
import os

# Añadir el directorio actual al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.scripts.setup_db import create_tables, check_db_exists

def main():
    print("=" * 60)
    print("Inicializando base de datos para Guiones")
    print("=" * 60)
    
    if check_db_exists():
        print("\n✅ La base de datos ya existe.")
        print("   Ubicación: backend/guiones.db")
    else:
        print("\n🔄 Creando base de datos...")
        create_tables()
        print("\n✅ Base de datos creada correctamente.")
        print("   Ubicación: backend/guiones.db")
    
    print("\n" + "=" * 60)
    print("Configuración completa!")
    print("=" * 60)
    print("\nPara iniciar el backend:")
    print("  1. Crea un archivo .env en backend/ con tu API key:")
    print("     cp backend/.env.example backend/.env")
    print("     # Edita backend/.env y añade tu MISTRAL_API_KEY")
    print("\n  2. Inicia el servidor:")
    print("     python -m uvicorn backend.main:app --reload --host :: --port 8000")
    print("\n  3. O usa el script de inicio:")
    print("     ./start.sh backend")
    print("=" * 60)

if __name__ == "__main__":
    main()
