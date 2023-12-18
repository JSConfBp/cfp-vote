export default {
	title: "CFP Vote",
	votingStages: {
		'stage_1': {
			label: 'First Voting Round',
			voteUI: [
				{ label: 'nope', 		value: 0 },
				{ label: 'seen better',	value: 2 },
				{ label: 'maybe', 		value: 4 },
				{ label: 'absolutely', 	value: 8 },
			],
		},
		'stage_2': {
			label: 'Shortlisting Round',
			voteUI: [
				{ label: 'meh', value: 1 },
				{ label: 'yay', value: 2 },
				{ label: 'MUST', value: 3 }
			]
		}
	},
}
