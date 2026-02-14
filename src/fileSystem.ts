export const fileSystem = {
  '': { // root directory
    home: {
      thomas: {
        'README.txt': 'Welcome to your home directory, thomas!',
        About: {
          'Me.txt': 'This is the Me.txt file.',
        },
        Experience: {
          'Workplace1.txt': 'Details about Workplace1.',
        },
        Projects: {
          'Project1.txt': 'Details about Project1.',
        },
        Education: {
          'Education.txt': 'Education details.',
        },
        Blog: {
          'Feb 8th.txt': 'Blog post for Feb 8th.',
        },
        Skills: {
          'Frontend.txt': 'Frontend skills.',
          'Backend.txt': 'Backend skills.',
          'Cloud.txt': 'Cloud skills.',
          'IT.txt': 'IT skills.',
          'Other.txt': 'Other skills.',
        },
        Contact: {
          'Info.txt': 'Contact information.',
        },
      },
    },
    etc: {},
    bin: {
      'echo': '#!/bin/sh\necho $@',
      'ls': '#!/bin/sh\nls $@',
    },
    tmp: {},
  }
};