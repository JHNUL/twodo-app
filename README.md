# Vulnerable TODO app

Assignment for University of Helsinki Cyber Security course part 1.

## How to run

See the [README](/twodo-server/README.md) in twodo-server folder.

## List of vulnerabilities

Demonstrated vulnerabilities from the owasp 2017 list https://owasp.org/www-project-top-ten/2017/

1) https://owasp.org/www-project-top-ten/2017/A1_2017-Injection.html

Discovering that the application makes requests to '/api/todo', an attacker could try
a GET request with an injection '/api/todo/1 or true'. This will return all todos in
the database.

How to test: Create two users, log in with user A and create a couple of todos. Then
log in with user B and without creating any todos, append '/api/todo/1 or true'
to the url in the browser (e.g. "http://localhost:8088/api/todo/1 or true") and hit enter.
There is no html page for that route, but the browser should show all of user A's todos
as JSON.

twodo-server/src/repositories/todo.ts#get()

FIX: parameterization of input data to SQL queries
![vulnerability1](/images/vulnerability1.png)

2) https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication.html

Session maxAge is too long (5h). User can forget to logout and just close the
browser. If someone else uses the computer they can be directly logged in to
the site with the previous user's credentials while the session is still alive.

How to test: after creating a user and logging in, close browser and wait less
than 5 hours :). Open browser and navigate to the site. User should still be
logged in.

twodo-server/src/app.ts#init()

FIX: shorter maxAge for session, e.g. 15mins (depending on the application).
The session is refreshed on every request, so when the user is "active" on
the application, they won't be logged out in a disruptive way but leaving the
computer without logging out is safer.
![vulnerability2](/images/vulnerability2.png)

3) https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure.html

Using weak cryptographic algorithms and generating unsalted password hashes.

twodo-server/src/services/user.ts#register()
twodo-server/src/app.ts#init()

How to test: check from code.

FIX: Use current and secure encryption algorithms and salt rounds when generating pw hashes.
![vulnerability3a](/images/vulnerability3_1.png)
![vulnerability3b](/images/vulnerability3_2.png)


4) https://owasp.org/www-project-top-ten/2017/A7_2017-Cross-Site_Scripting_(XSS).html

The application or API includes unvalidated and unescaped user input as part of HTML output.

twodo-ui/src/views/todos/Todos.tsx

How to test: Create a todo with name `<strong>TORRDOOO!</strong>`. You should see that the rendered name in the table of todos is bolded.

FIX: The way this vulnerability is demonstrated is specific to the UI library used in
the application (React.js). To fix this, one should not use dangerouslySetInnerHTML
to begin with. However, if there is a use case for it care must be taken that it is not
used with any untrusted data.
![vulnerability4](/images/vulnerability4.png)

5) https://owasp.org/www-project-top-ten/2017/A10_2017-Insufficient_Logging%2526Monitoring.html

Any events, attacks or otherwise are not logged. The application is not able to monitor,
detect or alert for any attacks. In a non-security sense the application is also not
monitored for performance or usage patterns.

twodo-server/src/index.ts#start()

FIX: Enable logging. Take into use some monitoring service (if the service was really deployed).
![vulnerability5](/images/vulnerability5.png)

