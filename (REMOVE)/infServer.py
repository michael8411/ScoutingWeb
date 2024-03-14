import subprocess
import time
from pynput.keyboard import Key, Controller
from pynput.mouse import Button, Controller

keyboard = Controller()

while True:
    ssh_process = subprocess.Popen(["ssh", "-p", "443", "-R0:localhost:5173", "-L4300:localhost:4300", "qr@a.pinggy.io"], 
                                   stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, 
                                   universal_newlines=True)
    
    while True:
        output = ssh_process.stdout.readline()
        print(output.strip())
        if "password" in output.lower():
            keyboard.press(Key.enter)
            keyboard.release(Key.enter)
            break


    ssh_process.wait()

    time.sleep(60 * 60 + 10)