$(document).ready(() => {
  $.ajaxSetup({cache: false});
});

var ButtonBox = React.createClass({
  handleClick: function(evt) {
    var {tag, version, filename, reviewList} = this.props;
    var previousState = reviewList.state;
    switch (evt.target.dataset.choice) {
      case "fail":
        break;
      case "replace":
        previousState[tag].filename = previousState[tag].versions[version];
      case "pass":
        delete previousState.failures[filename];
    }
    reviewList.setState(previousState);
  },
  render: function () {
    return (
      <div className="button-box">
        <button onClick={this.handleClick} data-choice="pass">Pass</button>
        <button onClick={this.handleClick} data-choice="replace">Pass and replace</button>
        <button onClick={this.handleClick} data-choice="fail">Fail</button>
      </div>
    )
  }
});

var ReviewBox = React.createClass({
  render: function () {
    var {tag, version, filename, reviewList} = this.props;
    return (
      <div className="review-box">
        <img src={'images/' + this.props.filename} />
        <ButtonBox tag={tag} version={version} filename={filename} reviewList={reviewList} />
      </div>
    );
  }
});

var DownloadLink = React.createClass({
  render: function () {
    var data = btoa(JSON.stringify(this.props.data));
    return <a href={"data:application/octet-stream;charset=uft-16le;base64," + data} download="data.json">Download results</a>;
  }
});

var ReviewList = React.createClass({
  getInitialState: function () {
    return {
      failures: []
    };
  },
  componentDidMount: function () {
    $.getJSON('./data.json').done((data) => {
      this.setState(data);
    });
  },
  render: function () {
    var l = [];
    var {failures} = this.state;
    Object.keys(failures).forEach((filename) => {
      var {tag, version} = failures[filename];
      l.push(
        <ReviewBox key={filename} filename={filename} tag={tag} version={version} reviewList={this} />
      );
    });
    return (
      <div>
        {l}
        <DownloadLink data={this.state}/>
      </div>
    );
  }
});

ReactDOM.render(
  <ReviewList />,
  document.getElementById('list')
);
