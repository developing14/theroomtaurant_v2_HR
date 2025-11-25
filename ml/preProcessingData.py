import pandas as pd
from sklearn.impute import SimpleImputer

dsPath1 = 'assets/reviews.csv'
dsPath2 = 'assets/EuropeanRestaurantReviews.csv'
dsPath3 = 'assets/RestaurantReviews.csv'
dsPath4 = 'assets/Restaurant_Reviews.csv'

ds1 = pd.read_csv(dsPath1)
ds2 = pd.read_csv(dsPath2)
ds3 = pd.read_csv(dsPath3)
testDS = pd.read_csv(dsPath4)

ds = pd.concat([ds1, ds2, ds3], ignore_index=True)

reviewColumnPattern = ['Date','Category','Content','Label']

#
# Check required fields
# Capture neccesary fields
#

def columnsProcessing(ds, pattern):

    dsColsName = ds.columns.tolist()

    # If ds doesn't have enough columns in pattern, return False
    for field in pattern:
        if (field not in dsColsName): return False

    # Drop cols which is not included in pattern
    for col in dsColsName:
        if (col not in pattern): 
            ds = ds.drop(col, axis=1)


    return ds

# 

ds = columnsProcessing(ds, reviewColumnPattern)

print(ds.head())

