import os
import shutil
from datetime import datetime
from pathlib import Path
from utils import *
from global_variables import *

def copy_footage(storageDevice, camera):
    print("Copying footage from " + camera + " to " + storageDevice)

    # Get camera footage directories
    cameraFootagePath = getCameraFootagePath(camera)
    cameraDirectories = os.listdir(cameraFootagePath)
    numberOfCameraDirectories = len(cameraDirectories)
    # Go through each directory for camera footage
    for directory in cameraDirectories:
        # Print camera directory being copied
        directoryNumber = cameraDirectories.index(directory) + 1
        if directoryNumber > 1:
            deleteLine()
            deleteLine()
        print("Processing directory " + directory + \
              " - " + str(directoryNumber) + \
              " out of " + str(numberOfCameraDirectories))
        # Get camera footage in directory
        footageDirectoryPath = cameraFootagePath + "\\" + directory
        footage = getFootageList(camera, footageDirectoryPath)
        numberOfVideos = len(footage)
        # Go through each video to be copied
        for video in footage:
            # Print video being copied
            videoNumber = footage.index(video) + 1
            if videoNumber > 1:
                deleteLine()
            print("Processing video " + video + \
                  " - " + str(videoNumber) + \
                  " out of " + str(numberOfVideos))
            # Copy the video to specific drive
            videoPath = footageDirectoryPath + '\\' + video
            copyVideoToDrive(storageDevice, camera, videoPath, video)

    print("Completed Copying footage from " + camera + " to " + storageDevice + "\n")

#########################################################
# Copy a video from a specific path to a storage device #
#########################################################
def copyVideoToDrive(storageDevice, camera, videoPath, videoName):
    validateStorageDeviceName(storageDevice)
    # Use created date for dating
    video_created_time = datetime.fromtimestamp(os.path.getctime(videoPath))
    # Get drive's footage path to get the video upload path
    # Create the path if it doesnt exist
    driveFootagePath = getDriveFootagePath(storageDevice)
    storage_path = driveFootagePath + "\\" + \
                    str(video_created_time.year) + "\\" + \
                    str(video_created_time.month) + " - " + month_converter(video_created_time.month) + "\\" + \
                    str(video_created_time.day) + "\\" + camera
    Path(storage_path).mkdir(parents=True, exist_ok=True)
    # Copy video if it doesnt exist
    destination_path = storage_path + "\\" + videoName
    if os.path.isfile(destination_path) is False:
        shutil.copy2(videoPath, destination_path)

def getFootageList(camera, footageDirectoryPath):
    footage = os.listdir(footageDirectoryPath)
    if camera == "DJI-Action-4":
        footage = [file for file in footage if not file.endswith(".LRF")]
    return footage

def getDriveFootagePath(storageDevice):
    return STORAGE_DEVICE_PATHS.get(storageDevice)

def getCameraFootagePath(camera):
    return CAMERA_PATHS.get(camera)

def validateStorageDeviceName(storageDevice):
    validStorageDevices = [
        "External Hard Drive",
        "G-Drive"
    ]
    if storageDevice in validStorageDevices:
        return True
    return False