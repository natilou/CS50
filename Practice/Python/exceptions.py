import sys

try:
    x = int(input("x: "))
    y = int(input("y: "))
except ValueError:
    print("Error: Invalid input.")
    sys.exit(1)

try:
    result = x / y
except ZeroDivisionError:
    print("Error: cannot divide by 0.")
    sys.exit(1)  # exits the program with code 1, that means something went wrong with the program.

print(f"x / y = {result}")
