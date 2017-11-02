/**
 * Created by derrick.goh.2013 on 15/7/2015.
 */
AdminConfig = {
    name: 'Babyplanner',
    //Designate which emails are admins
    adminEmails: ['asd@asd.com','jiajing.tan.2013@sis.smu.edu.sg','babyplannersg@gmail.com'],
    //This is where I start to desginate what are the Collections that the Admin Dashboard can control.
    collections: {
        Packages: {
            icon: 'credit-card',
            omitFields: ['transaction_id','_id','Deleted','deleted'],
            tableColumns: [
                {label: 'Product Sub-Category', name: 'name'},
                {label: 'Name of Product', name: 'productName'},
                {label: 'Thumbnail', name: 'thumbnail'},
                {label: 'Price of Product', name: 'price'},
                {label: 'Url of Product', name: 'productUrl'},
                {label: 'Product Tags', name: 'tags'},
                {label: 'Is it basic', name: 'isBasic'},
                {label: 'Is it advanced', name: 'isAdvanced'},
                {label: 'Is it premium', name: 'isPremium'}
            ],
            color: 'red'
        },
        Guides: {
            //icon here comes from the package favicon; read their documentation to find out which keyword corresponds to which icon
            //Purely for aesthetical purposes.
            icon: 'wordpress',
            //This prevents the field "createdAt" from appearing, as it should just automatically be inserted at the time of creation.
            omitFields: ['createdAt','createdBy','transaction_id', '_id', 'Deleted'],
            //These designates what columns appear and what are their names.
            tableColumns: [
                { label: 'Category', name: 'category' },
                { label: 'Url', name: 'url' },
                { label: 'Post', name: 'title' }
            ],
            showEditColumn: true, // Set to false to hide the edit button. True by default.
            showDelColumn: true, // Set to false to hide the edit button. True by default.
            showWidget: false,
            color: 'blue'
        },
        Weekly: {
            icon: 'drupal',
            omitFields: ['createdAt','createdBy','transaction_id', '_id', 'Deleted'],
            tableColumns: [
                { label: 'The day of the Week', name: 'week'},
                { label: 'What\'s Happening', name:'whathap'},
                { label: 'Symptoms You Should Have', name:'symptoms'},
                { label: 'Baby Photo',name:'babyphoto'},
                { label: 'Photo Description', name:'photodesc'},
                { label:'What\'s Happening Baby',name:'whathapbaby'},
            ],
            color: 'blue'
        },
        Public: {
            icon: 'hospital-o',
            omitFields: ['transaction_id', '_id', 'Deleted'],
            tableColumns: [
                {label: 'Type of Service', name: 'type'},
                {label: 'Name of Hospital Providing Service', name: 'hospital'},
                {label: 'Price at Ward A', name: 'priceWardA'},
                {label: 'Price at Ward B1', name: 'priceWardB1'},
                {label: 'Price at Ward B2+', name: 'priceWardB2plus'},
                {label: 'Price at Ward B2', name: 'priceWardB2'},
                {label: 'Price at Ward C', name: 'priceWardC'},
                //{label: 'Price at 90th Percentile', name: 'price90'},
                //{label: 'Average Length of Stay (optional)', name: 'avglength'}
            ],
            color: 'white'
        },
        Private: {
            icon: 'hospital-o',
            omitFields: ['transaction_id', '_id', 'Deleted'],
            tableColumns: [
                {label: 'Type of Service', name: 'type'},
                {label: 'Name of Hospital Providing Service', name: 'hospital'},
                {label: 'Price at One Bed', name: 'priceOneBed'},
                {label: 'Price at Two Bed', name: 'priceTwoBed'},
                {label: 'Price at Four Bed+', name: 'priceFourBed'},
                //{label: 'Price at 90th Percentile', name: 'price90'},
                //{label: 'Average Length of Stay (optional)', name: 'avglength'}
            ],
            color: 'white'
        },
        Journal: {
            icon: 'hospital-o',
            omitFields: ['transaction_id', '_id', 'Deleted'],
            tableColumns: [
                {label: 'All the symptoms for Journal', name: 'symptom'},
                {label: 'All the moods for Journal', name: 'moods'}
            ],
            color: 'blue'
        },
        Tooltips:{
            icon:'drupal',
            omitFields: ['transaction_id', '_id', 'Deleted'],
            tableColumns: [
                {label: 'Title of Tooltip', name: 'title'},
                {label: 'Description of Tooltip', name: 'description'}
            ],
            color: 'black'
        }
    },
    dashboard: {
        homeUrl: '/admin',
        skin: 'black',
        widgets: [
            {
                template: 'adminCollectionWidget',
                data: {
                    collection: 'Guides',
                    class: 'col-lg-3 col-xs-6',
                }
            },
            {
                template: 'adminCollectionWidget',
                data: {
                    collection: 'Weekly',
                    class: 'col-lg-3 col-xs-6',
                }
            },
            {
                template: 'adminCollectionWidget',
                data: {
                    collection: 'Private',
                    class: 'col-lg-3 col-xs-6',
                }
            },
            {
                template: 'adminCollectionWidget',
                data: {
                    collection: 'Public',
                    class: 'col-lg-3 col-xs-6',
                }
            },
            {
                template: 'adminCollectionWidget',
                data: {
                    collection: 'Journal',
                    class: 'col-lg-3 col-xs-6',
                }
            },
            {
                template: 'adminCollectionWidget',
                data: {
                    collection: 'Packages',
                    class: 'col-lg-3 col-xs-6',
                }
            },
            {
                template: 'adminCollectionWidget',
                data: {
                    collection: 'Tooltips',
                    class: 'col-lg-3 col-xs-6',
                }
            }
        ]
    }
};
