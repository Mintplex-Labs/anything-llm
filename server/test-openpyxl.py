import openpyxl
wb = openpyxl.load_workbook('merged-output.xlsx')
print("Sheets:", wb.sheetnames)
chart_sheet = wb["Chart"]
print("Chart sheet has drawing:", chart_sheet._drawing)
