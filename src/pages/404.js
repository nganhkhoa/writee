import React from 'react';

import {
  DefaultErrorPage
} from 'tabler-react';


class NotFound extends React.Component {
  render() {
    return <DefaultErrorPage
      title="404"
      subtitle="The requested page was not found on this server"
      action="Go back"
    />;
  }
}

export default NotFound;
