import React, { Component } from 'react';
import Terminal from 'terminal-in-react';
import './App.css';

export default class App extends Component {
  skills = () => 'Python, NodeJS, VB.NET, C#, SQL Server, MySQL, MariaDB, MongoDB'
  projects = () => 'Not yet implemented!'

  
  render() {
    return (
      <div>

        <Terminal watchConsoleLogging
          color="white"
          backgroundColor="black"
          hideTopBar={true}
          allowTabs={false}
          startState="maximised"
          showActions={false}
          prompt='white'
          promptSymbol='root@osgioia.dev:~$'
          style={{ fontWeight: 'bold', fontSize: '1em', width: "100%" , height: "100vh" }}
          commands={{
            'twitter': () => window.open('https://twitter.com/aioigzo', '_blank'),
            'github': () => window.open('https://github.com/osgioia/', '_blank'),
            'linkedin': () => window.open('https://www.linkedin.com/in/osvaldogioia/', '_blank'),
            'codepen': () => window.open('https://codepen.io/osgioia/', '_blank'),
            'blog': () => window.open('', '_blank'),
            skills: this.skills,
            projects: this.projects,
          }}
          descriptions={{
            'twitter': 'My Twitter',
            'github': 'My Repo in Github',
            'linkedin': 'My Linkedin Profile',
            'codepen': 'Codepen Profile',
            'blog': 'My Blog :)',
            'skills': 'Show Skills',
            'projects': 'Show Projects',

          }}
          msg= {[
            'Welcome To Osvaldo Gioia - FullStack Developer!',
            'Type "help" for the commands.'
          ].join('\n')}  
        />
      </div>
    );
  }
}