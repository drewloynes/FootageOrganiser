from transfer_footage import getCameraFootagePath
import os
import shutil

def clean_camera_footage(camera):
    print("Deleting footage on " + camera)
    # Get footage path
    cameraFootagePath = getCameraFootagePath(camera)
    cameraDirectories = os.listdir(cameraFootagePath)
    # Go through each directory for camera footage and delete it
    for directory in cameraDirectories:
        print("Deleting Directory: " + directory)
        shutil.rmtree(cameraFootagePath + "\\" + directory)
