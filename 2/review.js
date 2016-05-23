var ReviewBox = React.createClass({
  render: function () {
    return (
      <img src={'images/' + this.props.filename} />
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
        <ReviewBox key={image.filename} filename={image.filename} />
      );
    });
    return <div>{l}</div>;
  }
});

ReactDOM.render(
  <ReviewList />,
  document.getElementById('list')
);
