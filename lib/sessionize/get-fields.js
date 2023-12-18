
module.exports = (data) => {
  const fields = [
    { field: 'Title', id: `s_0` },
    { field: 'Description', id: `s_1` },
    // todo more fields?
    // ...data.questions.map(item => ({ field: item.question, id: `q_${item.id}` })),
    // ...data.categories.map(item => ({ field: item.title, id: `c_${item.id}` })),
  ]

  return fields
}



/*

sessions: [
{
  id: 'TALK_ID',
  title: 'text'
  description: 'text'
  speakers: [ 'SPEAKER_ID' ],
  categoryItems: [],
  questionAnswers: [
    {
      questionId: 26626,
      answerValue: 'text'
    },
    { questionId: 26627, answerValue: 'color' }
  ],
}
]

speakers: [

      {
      id: 'SPEAKER_ID',
      firstName: '',
      lastName: '',
      bio: '',
      tagLine: '',
      profilePicture: 'https://sessionize.com/image/',
      links: [Array],
      sessions: [Array],
      fullName: '',
      categoryItems: [ 69739, 69743, 69744 ],
      questionAnswers: [
    { questionId: 26628, answerValue: 'they/them' },
    { questionId: 26629, answerValue: 'name' },
    { questionId: 26631, answerValue: 'No' },
    { questionId: 26632, answerValue: 'No' },
    { questionId: 26633, answerValue: 'No' },
    { questionId: 26634, answerValue: 'No' },
    { questionId: 26635, answerValue: 'country' }
  ]
    }
]

questions: [
    {
      id: 26625,
      question: 'Personal details of your talk',
      questionType: 'Long_Text',
      sort: 0
    },
    {
      id: 26626,
      question: 'Previous talks',
      questionType: 'Long_Text',
      sort: 1
    },
  ]
categories: [
    {
      id: 26630,
      title: 'Shirt size',
      items: [Array],
      sort: 28,
      type: 'speaker'
    },
    {
      id: 26636,
      title: 'My company / employer can sponsor me',
      items: [Array],
      sort: 34,
      type: 'speaker'
    },
    {
      id: 26638,
      title: 'Code of Conduct',
      items: [Array],
      sort: 36,
      type: 'speaker'
    }
  ],


    */
