var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          displayRepos(data, user);
        });
      } else {
        alert('Error: GitHub User Not Found');
      }
    })
    .catch(function(error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to GitHub");
    });
  };
  
// selecting html elements for variables
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

// function to run once form submission broswer event is triggered
var formSubmitHandler = function(event) {
    // prevents the browser from performing the default action the event wants it to do. 
    event.preventDefault();
     // retrieves what was inputted in the input element, then trims it in case there's any accidental spaces.
    // stores it under variable 'username'.
     var username = nameInputEl.value.trim();
    // if a truthy value is inputted for username....
    if (username) {
        // run the getUserRepos function with that value ...
        getUserRepos(username);
        // then clear the input form for another username value.
        nameInputEl.value = "";
    }
    // if a falsy value is inputted for username....
    else {
        // window alert. 
        alert("Please enter a GitHub username.");
    }
    console.log(event);
};


var displayRepos = function(repos, searchTerm) {
    //repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        
        // create a link for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        // create a span element t ohold repository name 
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        //append to container
        repoEl.appendChild(statusEl);
        // append container to the dom
        repoContainerEl.appendChild(repoEl);

        // check if api returned any repos
        if (repos.length === 0) {
            repoContainerEl.textContent = "No repositories found.";
            return;
        }
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);

