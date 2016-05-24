var ButtonBox = React.createClass({
  handleClick: function(evt) {
    switch (evt.target.dataset.choice) {
      case "pass":
      case "replace":
      case "fail":
    }
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
    return (
      <div className="review-box">
        <img src={'images/' + this.props.filename} />
        <ButtonBox tag={this.props.tag} version={this.props.version} />
      </div>
    );
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
    this.state.failures.forEach(function (image) {
      l.push(
        <ReviewBox key={image.filename} filename={image.filename} tag={image.tag} version={image.version} />
      );
    });
    return <div>{l}</div>;
  }
});

ReactDOM.render(
  <ReviewList />,
  document.getElementById('list')
);
