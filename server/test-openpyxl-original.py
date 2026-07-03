import openpyxl
wb = openpyxl.load_workbook('original-chart.xlsx')
chart_sheet = wb["Chart"]
print("Original Chart sheet has drawing:", chart_sheet._drawing)
