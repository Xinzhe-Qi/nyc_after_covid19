library(tidycensus)

## Run only when running the code for the first time:
# census_api_key(key = "YOUR_KEY")
# First time, reload your environment so you can use the key without restarting R.
# readRenviron("~/.Renviron")
# You can check it with:
# Sys.getenv("CENSUS_API_KEY")
## End(Not run)

acs1yr2019 <- get_acs(
  geography = "puma",
  variables = c("S1701_C03_001", "S1501_C02_015", "S2801_C02_017"),
  state = "NY",
  survey = "acs1",
  year = 2019, geometry = FALSE)
ny_acs1yr2019 <- acs1yr2019[grep("36037|36038|36039|36040|36041", acs1yr2019$GEOID),]

ny_acs1yr2019 <-ny_acs1yr2019 %>% 
  mutate(varlab = recode(variable, 
                         S1701_C03_001 = "Poverty",
                         S1501_C02_015 = "Education",
                         S2801_C02_017 = "Broadband"))

# S1701_C03_001E: % Population living under poverty
# S1501_C02_015: % Population 25 years and over, Bachelor's degree or higher
# S2801_C02_017: % of household, broadband of any type

write.csv(ny_acs1yr2019, row.names = FALSE, file = "/resources/acs.csv")