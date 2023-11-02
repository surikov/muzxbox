type MenuInfo = {
    text: string;
    focused?: boolean;
    opened?:boolean;
    children?: MenuInfo[];
    sid?:number;
};
let testMenuData: MenuInfo[] = [
    { text: 'One' }
    , {
        text: 'Two', children: [{ text: 'One' }
            , { text: 'Two' }
            , { text: 'Orange' ,focused:true}
            , { text: 'Blue' }
            , { text: 'Green' }
            , {
            text: 'Brown', children: [{ text: 'One' }
                , { text: 'Two' }
                , { text: 'Orange' }
                , {
                text: 'Blue', children: [{ text: 'One' }
                    , { text: 'Two' }
                    , { text: 'Orange' }
                    , { text: 'Blue' }
                    , { text: 'Green' }
                    , {
                    text: 'Brown', children: [{ text: 'One' }
                        , { text: 'Two' }
                        , {
                            text: 'Orange', children: [{ text: 'One' }
                                , { text: 'Two' }
                                , { text: 'Orange' }
                                , { text: 'Blue' }
                                , { text: 'Green' }
                                , {
                                text: 'Brown', children: [{ text: 'One' }
                                    , { text: 'Two' }
                                    , { text: 'Orange' }
                                    , { text: 'Blue' }
                                    , { text: 'Green' }
                                    , { text: 'Brown' }
                                    , { text: 'eleven' }]
                            }
                                , {
                                text: 'eleven', children: [{ text: 'One' }
                                    , { text: 'Two' }
                                    , { text: 'Orange' }
                                    , { text: 'Blue' }
                                    , { text: 'Green' }
                                    , { text: 'Brown' }
                                    , { text: 'eleven' }]
                            }]
                    }
                        , { text: 'Blue' }
                        , { text: 'Green' }
                        , { text: 'Brown' }
                        , { text: 'eleven' }]
                }
                    , {
                    text: 'eleven', children: [{ text: 'One' }
                        , { text: 'Two' }
                        , { text: 'Orange' }
                        , { text: 'Blue' }
                        , { text: 'Green' }
                        , { text: 'Brown' }
                        , { text: 'eleven' }]
                }]
            }
                , { text: 'Green' }
                , { text: 'Brown' }
                , { text: 'eleven' }]
        }
            , {
            text: 'eleven', children: [{ text: 'One' }
                , { text: 'Two' }
                , { text: 'Orange' }
                , { text: 'Blue' }
                , { text: 'Green' }
                , { text: 'Brown' }
                , { text: 'eleven' }]
        }]
    }
    , { text: 'Orange' }
    , { text: 'Blue'  }
    , {
        text: 'Green',focused:true, children: [{ text: 'One' }
            , { text: 'Two' }
            , { text: 'Orange' }
            , { text: 'Blue' }
            , { text: 'Green' }
            , { text: 'Brown' }
            , { text: 'eleven' }]
    }
    , {
        text: 'Brown', children: [{ text: 'One' }
            , { text: 'Two' }
            , {
            text: 'Orange', children: [{ text: 'One' }
                , { text: 'Two' }
                , { text: 'Orange' }
                , { text: 'Blue' }
                , { text: 'Green' }
                , {
                text: 'Brown', children: [{ text: 'One' }
                    , { text: 'Two' }
                    , { text: 'Orange' }
                    , { text: 'Blue' }
                    , { text: 'Green' }
                    , { text: 'Brown' }
                    , { text: 'eleven' }]
            }
                , {
                text: 'eleven', children: [{ text: 'One' }
                    , { text: 'Two' }
                    , { text: 'Orange' }
                    , { text: 'Blue' }
                    , { text: 'Green' }
                    , { text: 'Brown' }
                    , { text: 'eleven' }]
            }]
        }
            , {
            text: 'Blue', children: [{ text: 'One' }
                , { text: 'Two' }
                , { text: 'Orange' }
                , { text: 'Blue' }
                , { text: 'Green' }
                , {
                text: 'Brown', children: [{ text: 'One' }
                    , { text: 'Two' }
                    , { text: 'Orange' }
                    , { text: 'Blue' }
                    , { text: 'Green' }
                    , { text: 'Brown' }
                    , { text: 'eleven' }]
            }
                , {
                text: 'eleven', children: [{ text: 'One' }
                    , { text: 'Two' }
                    , { text: 'Orange' }
                    , { text: 'Blue' }
                    , { text: 'Green' }
                    , { text: 'Brown' }
                    , { text: 'eleven' }]
            }]
        }
            , { text: 'Green' }
            , { text: 'Brown' }
            , { text: 'eleven' }]
    }
    , { text: 'eleven' }
];
