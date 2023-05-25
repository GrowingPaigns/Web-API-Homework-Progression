#### Name: Samuel Hilfer
#### Course: CSCI 3916
#### Assignment: 3

# Web Apps and Databases

### React render website link:
[React app website which uses the assignment 3 backend found in this repo](https://csci3916-react-ke6t.onrender.com)


### To-Do List:
| Requrements                                                                                                        | Completed |
|--------------------------------------------------------------------------------------------------------------------|-----------|
| React app sign-in/up on render                                                                                     | √         |
| Movie Schema supports required attributes                                                                          | √         |
| Server.js supports CRUD operations for /movies routes <br/> (/movies CRUD operations depend on JWT authentication) | √         |
| Backend deployed on render, tested with postman                                                                    | √         |
| Backend has numerous error checks/conditions                                                                       | √         |
| Each postman request has its own test conditions                                                                   | √         |

### Notes for Testing
To start, the easiest way to test my postman project is to send the requests in the following order:

    Signup

    Signin

    PostMovie

    GetMovie

    PutMovie

    DeleteMovie

if you follow these steps, all that needs to be done is pressing the 'send' button. If you press send multiple times on the same request, you can even easily test some of the error catches I have added.

Past that, I was unable to figure out how to search for a specific film (GET request) using more than one parameter. To specify, I can, and previously have set up my code to be able to search for a film based off of a signle parameter such as the title, date, genre, and actor name(s). I have also been able to get it working in a way that requires you to input multiple parameters before it will return a result (i.e. /movies/:title/:date). however, I have not been able to find a way to search for those parameters interchangably with the url style (/movies/:params). What this means is that, as of now, you can only search for a specific film using the title in the url parameter ( i.e. https://csci3916-assignment3-94ct.onrender.com/movies/The Hunger). 

I tried in multiple different ways to get my code operating in a way so that I could change out what parameter I was searching for on the fly, but none of the solutions I came up with worked. Even after exhausting my resources and asking chatgpt to debug my code/suggest ways to make the multi-parameter work, I was still unable to find a solution.

### Postman Project Button
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/25584291-0a83737f-318b-40d1-b323-548622395be1?action=collection%2Ffork&collection-url=entityId%3D25584291-0a83737f-318b-40d1-b323-548622395be1%26entityType%3Dcollection%26workspaceId%3Dce4a7f89-3453-4c18-92be-9d5ef29c0e40#?env%5BHilferAssignment3%5D=W3sia2V5IjoiR0VUX21lc3NhZ2UiLCJ2YWx1ZSI6IkdFVCBtb3ZpZXMiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6IkdFVCBtb3ZpZXMiLCJzZXNzaW9uSW5kZXgiOjB9LHsia2V5IjoiUE9TVF9tZXNzYWdlIiwidmFsdWUiOiJtb3ZpZSBzYXZlZCIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoibW92aWUgc2F2ZWQiLCJzZXNzaW9uSW5kZXgiOjF9LHsia2V5IjoiUFVUX21lc3NhZ2UiLCJ2YWx1ZSI6Im1vdmllIHVwZGF0ZWQiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6Im1vdmllIHVwZGF0ZWQiLCJzZXNzaW9uSW5kZXgiOjJ9LHsia2V5IjoiREVMX21lc3NhZ2UiLCJ2YWx1ZSI6Im1vdmllIGRlbGV0ZWQiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6Im1vdmllIGRlbGV0ZWQiLCJzZXNzaW9uSW5kZXgiOjN9LHsia2V5IjoiSldUX3Rva2VuIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6IkpXVC4uLiIsInNlc3Npb25JbmRleCI6NH1d)
