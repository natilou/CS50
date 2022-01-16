# A decorator is going to be a function that takes a function as input,
# and retuns a modified version of that function as output


def announce(f):
    def wrapper():
        print("About to run the function ...")
        f()
        print("Done whit the function")

    return wrapper


@announce
def hello():
    print("hello")


hello()
