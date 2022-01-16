people = [
    {"name": "Harry", "house": "Gryffindor"}, 
    {"name": "Draco", "house": "Slytherin"},
    {"name": "Cho", "house": "Ravenclaw"} 
]

# def f(person):
#     return person["name"]

# people.sort(key=f)

# with lambda functin you can do it in one line, without create a function

people.sort(key = lambda person: person["name"])

print(people)