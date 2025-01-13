
def deleteLine():
    print("\033[1A\x1b[2K", end="")

def month_converter(month):
    months = [
         "January",
         "Febuary",
         "March",
         "April",
         "May",
         "June",
         "July",
         "August",
         "September",
         "October",
         "November",
         "December"
    ]
    return months[month-1]