## Jus'Watch

* [Project Contributors](#project-contributors)
* [General info](#general-info)
* [Technologies](#technologies)
* [Content](#content)
* [Citations](#citations)
* [Quick Start](#quick-start)


## Project Contributors

| First Name        | Last Name     | Number     | GitHub   |
| ------------------| ------------- | ----------:|---------:|
| Josef             | Murillo       | A01204141  |[josefm93](https://github.com/josefm93)|
| Yow-Rong (Andy)   | Chang         | A01254277  |[yowrong](https://github.com/yowrong)|
| Yang (Shirley)    | Sun           | A01233640  |[Shirley-sy](https://github.com/josefm93)|
| Zichun (Lillian)  | Xu            | A01233266  |[ZIchunXu](https://github.com/Shirley-SY)|

## General Info
Just Watch is a web/mobile application platform that connects friends and groups of people through watching movies. It acts as a hub similar to a movie club, and allows users to nominate and vote for movies that they as a group would like to watch.  Users can also post reviews and comments to their group’s page to facilitate discussion of the movie after watching. 

## Technologies
**Technologies used for this project:**
* HTML
* CSS
* JavaScript
* jQuery
* Bootstrap 
* Firebase
* OMDb API
* Node.js
* Jest
* Selenium IDE

## Content
**Content of the project folder:**

```

 Top level of project folder: 
├── .gitignore                                  # Git ignore file
├── 404.html
├── about-us.html
├── create-group.html
├── easter.html
├── group-centre.html
├── group-main.html
├── group-msgs.html
├── index.html                                  # landing HTML file
├── invite.html   
├── login.html   
├── main.html   
├── movieresult.html  
├── msgs-main.html    
├── nominate.html   
├── package-lock.json
├── package.json
├── post-review.html
├── profile_favorite.html
├── profile_info.html
├── profile.html
├── README.md   
├── schema.js   
├── search.html
└── vote.html


It has the following subfolders and files:
├── .git                                        # Folder for git repo
├── .vscode                                     # Folder for vscode settings
    /settings.json
├── css                                         # Folder for CSS styling
    /about-us.css
    /basic.css
    /create-group.css
    /easter-egg.css
    /footer.css
    /group-centre.css
    /group-main.css
    /group-msgs.css
    /index.css
    /invite.css
    /login.css
    /main.css
    /moviedescription.css
    /msgs-main.css
    /nominate.css
    /post-review.css
    /profile.css
    /search.css
    /vote.css
├── img                                         # Folder for images
    /android-chrome-192x192.png
    /android-chrome-512x512.png
    /ant-man3.jpg
    /apple-touch-icon.png
    /avatar_andy.png
    /avatar_josef.png
    /avatar_lillian.png
    /avatar_shirley.png
    /download.jpg
    /favicon-16x16.png
    /favicon-32x32.png
    /favicon.ico
    /search.png
    /search1.png
    /site.webmanifest
    /spongebob.jpg
    /the6thsense.jpg
    /theGreatWall.png
    /totoro-bus-stop.jpg
├── js                                         # Folder for JavaScript files
    /about-us.js
    /create-group.js
    /easter-egg.js
    /firebase-api.js
    /firebase-queries.js
    /group-centre.js
    /group-main.js
    /group-msgs.js
    /index.js
    /invite.js
    /login.js
    /logout.js
    /main.js
    /msgs-main.js
    /nominate.js
    /post-review2.js
    /profile_favorite.js
    /profile-info.js
    /profile.js
    /searchtest.js
    /vote.js
└── test                                        # Folder for Jest test files
    /firebase-queries.test.js
    /group-centre.test.js
    /group-main.test.js
    /nominate.test.js
    /vote.test.js
```

## Citations
**Pictures, libraries, API's etc.**

Icons from [FontAwesome](fontawesome.com/)

Favicon generated on favicon.io

Avatars generated on [AvatarMaker](avatarmaker.com/)

[OMDb API: Open Movie Database](omdbapi.com/)

[Bootstrap v5.0.0-beta3](getbootstrap.com/)

[Jus'Watch Testing Plan Copy](https://docs.google.com/spreadsheets/d/1JcSVw80WtJHWNZSYtHL2W1-8CvyXyQuuxiFKnIfO71U/edit?usp=sharing)

[IMDB Top 1000 Movies Dataset](https://raw.githubusercontent.com/peetck/IMDB-Top1000-Movies/master/IMDB-Movie-Data.csv)

[Easter Egg Animation](https://codepen.io/alexisr/pen/dJmpdR)

[Movie Cards](https://blog.avada.io/examples/bootstrap-movie-cards-sukhmeet.html)

[Index Page Movie Cards](https://blog.avada.io/examples/responsive-movie-card-dark-version-zimuzo-ejinkeonye.html)

[Favourite Movie List Styling](https://codepen.io/soufiane-khalfaoui-hassani/pen/LYpPWda)

[Social Media Sharelinks](https://codepen.io/JAGATHISH1123/)

Various code snippets were referenced and are attributed on their respective .js files.  

“All the images and graphics used in this repo belong to their respective owners and we do not claim any right over them.

Copyright Disclaimer under section 107 of the Copyright Act of 1976, allowance is made for “fair use” for purposes such as criticism, comment, news reporting, teaching, scholarship, education and research. Fair use is a use permitted by copyright statute that might otherwise be infringing.”

## Quick Start

1. Clone the repository into a folder
2. Open directory in terminal
3. Enter 'npm install' in terminal to install dependencies in package.json
4. Create new Firebase project to use Cloud Firestore
5. Replace ```firebaseConfig``` information in firebase-api.js with new Firebase project found in "SDK setup and configuration" under project settings.  
6. (Optional) Generate new API key from OMDb and replace instances found in firebase-queries.js and searchtest.js. Note: API keys in this repo are limited to 1000 requests/day but can be upgraded.