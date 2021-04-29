# labelcv-web
Web UI for Label CV platform

## Front
### Install Front 
 ```
git clone https://github.com/surfriderfoundationeurope/LabelCV
git fetch 
git checkout develop
```

### Launch Front
```
npm install 
npm run serve
```

### Contribute to Front 
Make a branch out of `develop` and when your work is ready, 
open a Pull Request from your branch to `develop` that should 
be reviewed by someone else ! 
```
git checkout -b develop/{custom-name}
git commit -m ...
git push 
```
And then, you can do a PR from your branch to branch 
`develop`.


## Back

### Install Back 

```
git clone https://github.com/surfriderfoundationeurope/LabelCV
git fetch 
git checkout dev
cd api/labelcv-api
```
Create a .env file in `api/labelcv-api` and copy-paste 
(Fields with ***** are private and their content 
should be asked to Antoine or Christophe ) 
```
COSMOSDB_ENDPOINT=https://labelcvdemo.documents.azure.com:443
COSMOSDB_KEY=********
API_PORT=443
AZURE_STORAGE_SAS_KEY=********
AZURE_STORAGE_ACCOUNT=labelcvdevdemo
AZURE_STORAGE_CONTAINER_NAME=labelcvdemo1
COSMOSDB_EMULATOR_USED=true
AZURE_TEST_ENV=********
AZURE_ACCOUNT_NAME=storageplasticodev
AZURE_ACC_KEY=********
PG_IMG_TABLE=images_for_labelling
PG_TRASH_TABLE=campaign.trash_type
PG_LABEL_SCHEMA=label
PG_BOUNDINGBOX_TABLE=bounding_boxes
PG_DATABASE=plastico-dev
PG_USERNAME=writer_user@pgdb-plastico-dev
PG_PWD=********
PG_HOST=pgdb-plastico-dev.postgres.database.azure.com
```

### Launch Back
```
cd api/labelcv-api
npm install 
npm run start:dev
```
You should get message `Client Postgres connected !` 
