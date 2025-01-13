from drive_properties import *
from transfer_footage import copy_footage
import click
from delete_footage import clean_camera_footage

@click.command()
@click.option('--storage', default="all", help='Storage device to save footage on. (all uses all devices)')
@click.option('--camera', default="all", help='Camera to copy footage from. (all uses all cameras)')
@click.option('--clean-camera', default="no", help='Delete footage from cameras when copied over. (Y/N)')
@click.option('--clean-only', default="no", help='Only delete footage from cameras, do no copying. (Y/N)')
def main(storage, camera, clean_camera, clean_only):
    print("Attempting to copy footage with settings:\n" +
          "--storage = " + storage + "\n" +
          "--camera = " + camera + "\n" +
          "--clean-camera = " + clean_camera + "\n" +
          "--clean-only = " + clean_only + "\n" )
    # Validate User Inputs - End if not valid
    if validateUserInputs(storage, camera, clean_camera, clean_only) is False:
        return
    storeUserInputs(storage, camera, clean_camera, clean_only)
    # Check access to necessary drives
    setDrivesToAccess()
    if checkDriveAccess() is False:
        print('\nFootage copying not started.\
               \nUnable to access necessary storgage drives.')
        return
    print_storage_sizes()
    # Check to copy footage over
    while True:
        if USER_INPUTS["clean only"] in USER_INPUT_NO:
            print("\nDo you still want to transfer the footage? (Y/N)")
        else:
            print("\nDo you still want to delete the footage? (Y/N)")
        continueProcessing = input()
        if continueProcessing.lower() in ["yes", "y"]:
            print("Continuing...\n")
            break
        elif continueProcessing.lower() in ["no", "n"]:
            print("Exiting...")
            return
        else:
            print("Invalid input. Please enter Y/N.")
    
    # Begin copying footage if intended.
    if USER_INPUTS["clean only"] in USER_INPUT_NO:
        # Copy footage from lumix
        if USER_INPUTS["camera"] in ["all", "lumix"]:
            if USER_INPUTS["storage"] in ["all", "external"]:
                # Copy lumix footage to hard drive
                copy_footage("External Hard Drive", "Lumix")
            if USER_INPUTS["storage"] in ["all", "google"]:
                # Copy lumix footage to google drive
                copy_footage("G-Drive", "Lumix")
        # Copy footage from DJI
        if USER_INPUTS["camera"] in ["all", "dji"]:
            if USER_INPUTS["storage"] in ["all", "external"]:
                # Copy dji footage to hard drive
                copy_footage("External Hard Drive", "DJI-Action-4")
            if USER_INPUTS["storage"] in ["all", "google"]:
                # Copy DJI footage to google drive
                copy_footage("G-Drive", "DJI-Action-4")

    # Delete footage on camera
    if USER_INPUTS["clean only"] in USER_INPUT_YES or USER_INPUTS["clean camera"] in USER_INPUT_YES:
        if USER_INPUTS["camera"] in ["all", "lumix"]:
            clean_camera_footage("Lumix")
        if USER_INPUTS["camera"] in ["all", "dji"]:
            clean_camera_footage("DJI-Action-4")
    # Completed Successfully
    print('Complete Successfully')

def validateUserInputs(storage, camera, cleanCamera, cleanOnly):
    print("Validating User Input")
    validStorage = validateStorageOption(storage)
    validCamera = validateCameraOption(camera)
    validCleanCamera = validateCleanCameraOption(cleanCamera)
    validCleanOnly = validateCleanOnlyOption(cleanOnly)
    if (validStorage & validCamera & validCleanCamera) or \
        (validCleanOnly & validCamera):
        return True
    return False

def validateStorageOption(storage):
    if storage.lower() in USER_INPUT_STORAGE_OPTIONS:
        return True
    print("The input for --storage was invalid please choose one of:\n"
          + str(USER_INPUT_STORAGE_OPTIONS))
    return False

def validateCameraOption(camera):
    if camera.lower() in USER_INPUT_CAMERA_OPTIONS:
        return True
    print("The input for --camera was invalid please choose one of:\n"
          + str(USER_INPUT_CAMERA_OPTIONS))
    return False

def validateCleanCameraOption(cleanCamera):
    if cleanCamera.lower() in USER_INPUT_YES_NO:
        return True
    print("The input for --clean-camera was invalid please choose yes (y) or no (n)") 
    return False

def validateCleanOnlyOption(cleanOnly):
    if cleanOnly.lower() in USER_INPUT_YES_NO:
        return True
    print("The input for --clean-only was invalid please choose yes (y) or no (n)") 
    return False

def storeUserInputs(storage, camera, cleanCamera, cleanOnly):
    USER_INPUTS["storage"] = storage.lower()
    USER_INPUTS["camera"] = camera.lower()
    USER_INPUTS["clean camera"] = cleanCamera.lower()
    USER_INPUTS["clean only"] = cleanOnly.lower()


if __name__ == '__main__':
    main()