const mapStateToProps = (state) => {
    return {
        dir: state.updateDir,
        dirData: state.updateDirData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateDirData: (dirData) => {
            dispatch(updateDirDataAction(dirData)),
        };
    };
};
