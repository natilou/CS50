
# import a specific function/name from module function
from functions import square

for i in range(10):
    print(f"The square of {i} is {square(i)}")


# import the whole module
import functions

for i in range(10):
    print(f"The square of {i} is {functions.square(i)}")
