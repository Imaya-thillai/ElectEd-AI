/**
 * Election Process Education Data
 * 
 * Comprehensive structured data about election processes, timelines,
 * and civic education. Serves as the knowledge base for the application.
 * 
 * @module data/electionData
 */

'use strict';

/**
 * Election process phases with detailed steps and descriptions.
 * @type {Array<Object>}
 */
const electionPhases = [
  {
    id: 'registration',
    title: 'Voter Registration',
    icon: '📋',
    color: '#4285F4',
    duration: 'Ongoing - Check deadlines',
    summary: 'The first step in participating in democracy is registering to vote.',
    steps: [
      { title: 'Check Eligibility', description: 'Verify you meet citizenship, age (18+), and residency requirements for your jurisdiction.' },
      { title: 'Gather Documents', description: 'Prepare your government-issued ID, Social Security number, and proof of current address.' },
      { title: 'Choose Registration Method', description: 'Register online through your state portal, by mail with a paper form, or in person at your local election office.' },
      { title: 'Submit Before Deadline', description: 'Most states require registration 15-30 days before an election. Some allow same-day registration.' },
      { title: 'Verify Registration', description: 'Check your registration status online or contact your local election office to confirm.' }
    ],
    tips: [
      'Update your registration if you move or change your name',
      'Some states offer automatic voter registration at the DMV',
      'College students can register at either their school or home address'
    ]
  },
  {
    id: 'pre-election',
    title: 'Pre-Election Period',
    icon: '📢',
    color: '#EA4335',
    duration: '6-12 months before Election Day',
    summary: 'Candidates declare, campaign, and voters research their choices.',
    steps: [
      { title: 'Candidate Filing', description: 'Candidates file official paperwork and meet requirements to appear on the ballot.' },
      { title: 'Campaign Period', description: 'Candidates share platforms, participate in debates, and engage with voters.' },
      { title: 'Research Candidates', description: 'Review candidate positions, voting records, and platforms from non-partisan sources.' },
      { title: 'Check Sample Ballot', description: 'Preview what your ballot will look like so you can make informed choices.' }
    ],
    tips: [
      'Use non-partisan voter guides to compare candidates',
      'Attend town halls or candidate forums in your area',
      'Check if there are any ballot measures or propositions to research'
    ]
  },
  {
    id: 'primary',
    title: 'Primary Elections',
    icon: '🏛️',
    color: '#FBBC04',
    duration: '3-6 months before General Election',
    summary: 'Political parties select their nominees through primary elections or caucuses.',
    steps: [
      { title: 'Understand Primary Types', description: 'Open primaries allow any voter; closed primaries require party registration; semi-closed allow independents.' },
      { title: 'Check Party Registration', description: 'In closed primary states, ensure you are registered with the party whose primary you wish to vote in.' },
      { title: 'Vote in Primary', description: 'Cast your vote to help select your preferred party nominee.' },
      { title: 'Follow Results', description: 'Primary results determine which candidates advance to the general election.' }
    ],
    tips: [
      'Primary dates vary by state - check your local schedule',
      'Some states use caucuses instead of primaries',
      'Participating in primaries gives you more influence in candidate selection'
    ]
  },
  {
    id: 'early-voting',
    title: 'Early & Absentee Voting',
    icon: '✉️',
    color: '#34A853',
    duration: '7-45 days before Election Day',
    summary: 'Vote before Election Day through early in-person voting or mail-in ballots.',
    steps: [
      { title: 'Check Availability', description: 'Not all states offer early voting. Check what options are available in your jurisdiction.' },
      { title: 'Request Absentee Ballot', description: 'If voting by mail, request your ballot before the deadline (usually 7-14 days before election).' },
      { title: 'Find Early Voting Locations', description: 'Locate early voting centers and check their hours of operation.' },
      { title: 'Cast Your Vote', description: 'Vote early in person or complete and return your mail-in ballot before the deadline.' },
      { title: 'Track Your Ballot', description: 'Many states let you track your mail-in ballot online to confirm it was received.' }
    ],
    tips: [
      'Early voting often has shorter lines than Election Day',
      'Mail your ballot early to ensure it arrives on time',
      'Keep your ballot receipt or tracking number'
    ]
  },
  {
    id: 'election-day',
    title: 'Election Day',
    icon: '🗳️',
    color: '#4285F4',
    duration: 'The designated voting day',
    summary: 'The main day when polls are open for all registered voters to cast their ballots.',
    steps: [
      { title: 'Find Your Polling Place', description: 'Look up your assigned polling station - you must vote at your designated location.' },
      { title: 'Bring Required ID', description: 'Check your state requirements for voter identification at the polls.' },
      { title: 'Check In with Poll Workers', description: 'Provide your name, show ID if required, and sign the poll book.' },
      { title: 'Mark Your Ballot', description: 'Carefully fill out your ballot following the provided instructions.' },
      { title: 'Submit Your Ballot', description: 'Feed your ballot into the scanner or place it in the ballot box.' },
      { title: 'Get Your Sticker', description: 'Collect your "I Voted" sticker and celebrate participating in democracy!' }
    ],
    tips: [
      'Polls typically open between 6-7 AM and close between 7-8 PM',
      'If in line when polls close, you have the right to vote',
      'If there are issues, ask for a provisional ballot'
    ]
  },
  {
    id: 'post-election',
    title: 'Post-Election Process',
    icon: '📊',
    color: '#EA4335',
    duration: 'Days to weeks after Election Day',
    summary: 'Votes are counted, audited, and results are officially certified.',
    steps: [
      { title: 'Vote Counting', description: 'Election officials count all ballots including mail-in, provisional, and military/overseas votes.' },
      { title: 'Canvassing', description: 'Officials verify vote totals and resolve any discrepancies in the count.' },
      { title: 'Audits', description: 'Post-election audits verify that electronic results match paper ballot records.' },
      { title: 'Certification', description: 'Election boards officially certify the results after verification is complete.' },
      { title: 'Transition', description: 'Elected officials prepare to take office and outgoing officials facilitate the transition.' }
    ],
    tips: [
      'Results on election night are unofficial projections',
      'Mail-in ballots may take days to fully count',
      'Recounts may be triggered if margins are very close'
    ]
  }
];

/**
 * Quiz questions for interactive election education.
 * @type {Array<Object>}
 */
const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the minimum voting age in most democratic countries?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correct: 1,
    explanation: 'In most democracies, including the United States, the minimum voting age is 18 years old.'
  },
  {
    id: 'q2',
    question: 'What is a "primary election"?',
    options: [
      'The final general election',
      'An election to select party nominees',
      'A local school board election',
      'An election held only in primary schools'
    ],
    correct: 1,
    explanation: 'Primary elections are held by political parties to select their candidates (nominees) for the general election.'
  },
  {
    id: 'q3',
    question: 'What should you do if you make a mistake on your ballot?',
    options: [
      'Cross it out and write next to it',
      'Submit it anyway',
      'Ask a poll worker for a new ballot',
      'Leave the polling place'
    ],
    correct: 2,
    explanation: 'If you make a mistake, ask a poll worker for a replacement ballot. They can void your spoiled ballot and issue a new one.'
  },
  {
    id: 'q4',
    question: 'What is "early voting"?',
    options: [
      'Voting before you turn 18',
      'Voting before polls officially open on Election Day',
      'A period before Election Day when you can cast your ballot',
      'Voting in the early morning hours'
    ],
    correct: 2,
    explanation: 'Early voting is a designated period before Election Day when registered voters can cast their ballots at designated locations.'
  },
  {
    id: 'q5',
    question: 'What is a "provisional ballot"?',
    options: [
      'A temporary ballot used during equipment failures',
      'A ballot given when your eligibility cannot be immediately confirmed',
      'A practice ballot for first-time voters',
      'A ballot used only in provisional states'
    ],
    correct: 1,
    explanation: 'A provisional ballot is given when there are questions about a voter\'s eligibility. It is counted after eligibility is verified.'
  },
  {
    id: 'q6',
    question: 'What does "canvassing" mean in the election context?',
    options: [
      'Painting campaign signs',
      'Going door-to-door for votes',
      'The official process of verifying and certifying vote totals',
      'Covering voting booths with canvas'
    ],
    correct: 2,
    explanation: 'Canvassing is the official process where election officials verify, recount if necessary, and certify the vote totals.'
  },
  {
    id: 'q7',
    question: 'Which of these is NOT typically required to register to vote?',
    options: [
      'Proof of citizenship',
      'Meeting the minimum age requirement',
      'Owning property',
      'Being a resident of the jurisdiction'
    ],
    correct: 2,
    explanation: 'Property ownership is not a requirement to vote in modern democracies. Basic requirements are citizenship, age, and residency.'
  },
  {
    id: 'q8',
    question: 'What happens if you are still in line when polls close?',
    options: [
      'You must leave immediately',
      'You can vote - anyone in line when polls close has the right to vote',
      'You need special permission to stay',
      'The polls automatically extend by one hour'
    ],
    correct: 1,
    explanation: 'If you are in line at your polling place when polls officially close, you have the legal right to stay and cast your vote.'
  },
  {
    id: 'q9',
    question: 'What is the purpose of post-election audits?',
    options: [
      'To change the election results',
      'To find fraud and arrest people',
      'To verify that vote counts are accurate and systems worked correctly',
      'To prepare for the next election'
    ],
    correct: 2,
    explanation: 'Post-election audits are routine procedures to verify accuracy of vote counts and ensure election systems functioned properly.'
  },
  {
    id: 'q10',
    question: 'What is "ranked-choice voting"?',
    options: [
      'Voters rank candidates from most to least wealthy',
      'Only high-ranking officials can vote',
      'Voters rank candidates in order of preference',
      'Candidates are ranked by a committee'
    ],
    correct: 2,
    explanation: 'Ranked-choice voting allows voters to rank candidates in order of preference. If no candidate wins a majority, the lowest-ranked candidate is eliminated and their votes redistributed.'
  }
];

/**
 * Glossary of election-related terms.
 * @type {Array<Object>}
 */
const glossary = [
  { term: 'Absentee Ballot', definition: 'A ballot completed and mailed by a voter who cannot visit their polling place on Election Day.' },
  { term: 'Ballot Initiative', definition: 'A process allowing citizens to propose new laws or amendments by collecting signatures.' },
  { term: 'Caucus', definition: 'A meeting of party members to select candidates, distinct from a primary election.' },
  { term: 'Constituency', definition: 'A geographic area whose voters elect a representative.' },
  { term: 'Delegate', definition: 'A person chosen to represent others at a party convention or in the nomination process.' },
  { term: 'Electoral College', definition: 'The body of electors who formally elect the President and Vice President of the United States.' },
  { term: 'Franchise', definition: 'The right to vote in public elections; also called suffrage.' },
  { term: 'Gerrymandering', definition: 'Manipulating electoral district boundaries to favor a particular party or group.' },
  { term: 'Incumbent', definition: 'The current holder of a political office who is running for re-election.' },
  { term: 'Poll Watcher', definition: 'An authorized individual who observes voting and counting processes on behalf of a party or candidate.' },
  { term: 'Provisional Ballot', definition: 'A ballot cast when voter eligibility cannot be immediately confirmed, verified later.' },
  { term: 'Redistricting', definition: 'The process of redrawing electoral district boundaries, typically after a census.' },
  { term: 'Suffrage', definition: 'The right to vote in political elections.' },
  { term: 'Swing State', definition: 'A state where no single party has overwhelming support, making it competitive in elections.' },
  { term: 'Turnout', definition: 'The percentage of eligible voters who actually cast ballots in an election.' }
];

module.exports = { electionPhases, quizQuestions, glossary };
