<?php

return [
    'python_path' => env('PYTHON_PATH', '/usr/bin/python3'),
    'auth_scripts_path' => base_path('scripts') . '/authenticate.py',
    'exec_scripts_path' => base_path('scripts') . '/execute.py',
];