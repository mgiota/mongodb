import React from 'react';

export class DirectorView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { director } = this.props;

    // if (!director) return <div className="main-view">No director</div>;
    return (
       <div className="movie-view">
          <div>{director.Name}</div>
          <div>{director.Bio}</div>
       </div>
    );
  }
}
