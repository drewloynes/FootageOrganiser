import os
import shutil
from global_variables import *
from tabulate import tabulate

def setDrivesToAccess():
    # Add the storage locations if necessary
    if USER_INPUTS["clean only"] in USER_INPUT_NO:
        if USER_INPUTS["storage"] == "all" or \
        USER_INPUTS["storage"] == "external":
            DRIVES_TO_ACCESS["External Hard Drive"] = "I:"
        if USER_INPUTS["storage"] == "all" or \
        USER_INPUTS["storage"] == "google":
            DRIVES_TO_ACCESS["Google Drive"] = "G:"
    # Add the camera locations
    if USER_INPUTS["camera"] == "all" or \
    USER_INPUTS["camera"] == "lumix":
        DRIVES_TO_ACCESS["Lumix"] = "E:"
    if USER_INPUTS["camera"] == "all" or \
    USER_INPUTS["camera"] == "dji":
        DRIVES_TO_ACCESS["DJI-Action-4"] = "H:"

def checkDriveAccess():
    accessable = True
    print('\nChecking access to necessary drives:')
    for drive, path in DRIVES_TO_ACCESS.items():
        path_exists = os.path.exists(path)
        if path_exists:
            print("Access to", drive, "has been found.")
        else:
            print("Problem: Access to", drive, "can not be found.")
            accessable = False
    return accessable

def print_storage_sizes():
    DRIVES = DRIVES_TO_ACCESS.copy()
    DRIVES["Computer"] = "C:"
    total_list = []
    for drive, path in DRIVES.items():
        total_list
        total, used, free = shutil.disk_usage(path)
        drive_stats = [
            drive, 
            (total // (2**30)), 
            (used // (2**30)), 
            (free // (2**30))
            ]
        total_list.append(drive_stats)
    print(tabulate(total_list, 
                   headers=['Drive', 'Total (GiB)', 'Used (GiB)', 'Free (GiB)']))
