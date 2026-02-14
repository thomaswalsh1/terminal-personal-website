export const fileSystem = {
  '': { // root directory
    home: {
      thomas: {
        'README.txt': 'Welcome to your home directory, thomas!',
        About: {
          'Me.txt': 'Here is some quick info about Thomas',
        },
        Experience: {
          'Experience.txt': 'Here are some details about my work experience.',
        },
        Projects: {
          'LinuxLearner.txt': 'Details about LinuxLearner.',
          'IBMFullStack.txt': 'Details about my IBM Full Stack Capstone.',
          'Vent.txt': 'Details about the Vent App.',
          'SuperAI.txt': 'Details about the SuperAI.',
        },
        Education: {
          'Education.txt': 'Education details.',
        },
        Blog: {
          '2_14_26.txt': 'Blog post for Feb 14th.',
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