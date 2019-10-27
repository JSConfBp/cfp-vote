


export default () => {
    return (<>
        <Typography className={css.heading}>
            Voting Stage
        </Typography>
        <Typography variant="body1" component="div">
            <FormControl className={css.formControl}>
                <InputLabel htmlFor="stage-helper">Update voting stage</InputLabel>
                <NativeSelect
                    value={votingStage}
                    onChange={e => this.handleVoteState(e.target.value)}
                    input={<Input name="voting_stage" id="stage-helper" />}
                >
                    {Object.entries(voting_stages).map(([key, stage]) => (
                        <option value={key} key={key}>{stage.label}</option>
                    ))}
                </NativeSelect>
                <FormHelperText>Update this if you're ready to summarize the first vote round</FormHelperText>
            </FormControl>
            <FormControl className={css.formControl}>
                <InputLabel htmlFor="vote-limit">Vote count limit</InputLabel>
                <Input
                    type="number"
                    id="vote-limit"
                    value={this.state.voteLimit}
                    onChange={ (e) => this.handleVoteLimit(e.target.value)}
                    aria-describedby="vote-limit-helper-text"
                />
                <FormHelperText id="vote-limit-helper-text">
                    Include talks in second round with votes at least as much as this value.<br />
                    See the vote/talk chart in <Link to="stats"><a>Statistics</a></Link> to determine this number
                </FormHelperText>
            </FormControl>
            <FormControl className={css.formControl}>
                <Button onClick={e => this.updateStage()}color="secondary" variant={'contained'} >Update Stage</Button>
            </FormControl>
        </Typography>
    </>)
}