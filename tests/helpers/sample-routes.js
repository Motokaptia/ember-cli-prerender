/**
 * Sample routes from the dummy app
 */

export const routesWithoutDynamicSegments = {
    "sitemap-txt": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "sitemap.txt"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "sitemap-txt",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "sitemap-xml": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "sitemap.xml"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "sitemap-xml",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "index": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 4,
            "value": ""
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "index",
            "names": [],
            "shouldDecodes": []
        }]
    },
};

export const routesWithDynamicSegments = {
    "application_loading": {
        "segments": [{
            "type": 0,
            "value": "application_loading"
        }],
        "handlers": [{
            "handler": "application_loading",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "application_error": {
        "segments": [{
            "type": 0,
            "value": "_unused_dummy_error_path_route_application"
        }, {
            "type": 1,
            "value": "error"
        }],
        "handlers": [{
            "handler": "application_error",
            "names": ["error"],
            "shouldDecodes": [true]
        }]
    },
    "loading": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "loading"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "loading",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "error": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "_unused_dummy_error_path_route_application"
        }, {
            "type": 1,
            "value": "error"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "error",
            "names": ["error"],
            "shouldDecodes": [true]
        }]
    },
    "sitemap-txt_loading": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "sitemap-txt_loading"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "sitemap-txt_loading",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "sitemap-txt_error": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "_unused_dummy_error_path_route_sitemap-txt"
        }, {
            "type": 1,
            "value": "error"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "sitemap-txt_error",
            "names": ["error"],
            "shouldDecodes": [true]
        }]
    },
    "sitemap-txt": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "sitemap.txt"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "sitemap-txt",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "sitemap-xml_loading": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "sitemap-xml_loading"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "sitemap-xml_loading",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "sitemap-xml_error": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "_unused_dummy_error_path_route_sitemap-xml"
        }, {
            "type": 1,
            "value": "error"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "sitemap-xml_error",
            "names": ["error"],
            "shouldDecodes": [true]
        }]
    },
    "sitemap-xml": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "sitemap.xml"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "sitemap-xml",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "user_loading": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user_loading"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user_loading",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "user_error": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "_unused_dummy_error_path_route_user"
        }, {
            "type": 1,
            "value": "error"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user_error",
            "names": ["error"],
            "shouldDecodes": [true]
        }]
    },
    "user.loading": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 0,
            "value": "loading"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.loading",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "user.error": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 0,
            "value": "_unused_dummy_error_path_route_user"
        }, {
            "type": 1,
            "value": "error"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.error",
            "names": ["error"],
            "shouldDecodes": [true]
        }]
    },
    "user.photos_loading": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 0,
            "value": "photos_loading"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.photos_loading",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "user.photos_error": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 0,
            "value": "_unused_dummy_error_path_route_photos"
        }, {
            "type": 1,
            "value": "error"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.photos_error",
            "names": ["error"],
            "shouldDecodes": [true]
        }]
    },
    "user.photos": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 0,
            "value": "photos"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.photos",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "user.photo_loading": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 0,
            "value": "photo_loading"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.photo_loading",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "user.photo_error": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 0,
            "value": "_unused_dummy_error_path_route_photo"
        }, {
            "type": 1,
            "value": "error"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.photo_error",
            "names": ["error"],
            "shouldDecodes": [true]
        }]
    },
    "user.photo": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 0,
            "value": "photos"
        }, {
            "type": 1,
            "value": "photo_id"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.photo",
            "names": ["photo_id"],
            "shouldDecodes": [true]
        }]
    },
    "user.index_loading": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 0,
            "value": "index_loading"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.index_loading",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "user.index_error": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 0,
            "value": "_unused_dummy_error_path_route_index"
        }, {
            "type": 1,
            "value": "error"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.index_error",
            "names": ["error"],
            "shouldDecodes": [true]
        }]
    },
    "user.index": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 4,
            "value": ""
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.index",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "user": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "user"
        }, {
            "type": 1,
            "value": "user_id"
        }, {
            "type": 4,
            "value": ""
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "user",
            "names": ["user_id"],
            "shouldDecodes": [true]
        }, {
            "handler": "user.index",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "index_loading": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "index_loading"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "index_loading",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "index_error": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 0,
            "value": "_unused_dummy_error_path_route_index"
        }, {
            "type": 1,
            "value": "error"
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "index_error",
            "names": ["error"],
            "shouldDecodes": [true]
        }]
    },
    "index": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 4,
            "value": ""
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "index",
            "names": [],
            "shouldDecodes": []
        }]
    },
    "application": {
        "segments": [{
            "type": 4,
            "value": ""
        }, {
            "type": 4,
            "value": ""
        }],
        "handlers": [{
            "handler": "application",
            "names": [],
            "shouldDecodes": []
        }, {
            "handler": "index",
            "names": [],
            "shouldDecodes": []
        }]
    }
};
