import React from 'react'

const RouteContext = React.createContext({
  searchCaption: '',
  onChangeSearchCaption: () => {},
})

export default RouteContext
