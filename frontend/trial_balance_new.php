<?php

$mysqli = new mysqli(
    'localhost',
    'root',
    'rwitc',
    'db_rwitc_erp_uat'
);

$result = $mysqli->query("
SELECT
    account_no,
    SUM(CASE WHEN account_type='debit' THEN amount ELSE 0 END) debit,
    SUM(CASE WHEN account_type='credit' THEN amount ELSE 0 END) credit
FROM master_accounting_2025
WHERE delete_status='0'
AND account_no NOT IN (
    SELECT shname
    FROM oc_account_2025
)
GROUP BY account_no
ORDER BY (debit + credit) DESC
");

echo "<table border='1'>";
echo "<tr>
<th>Account</th>
<th>Debit</th>
<th>Credit</th>
<th>Total</th>
</tr>";

while($row = $result->fetch_assoc()){

    echo "<tr>";
    echo "<td>{$row['account_no']}</td>";
    echo "<td>".number_format($row['debit'],2)."</td>";
    echo "<td>".number_format($row['credit'],2)."</td>";
    echo "<td>".number_format($row['debit']+$row['credit'],2)."</td>";
    echo "</tr>";
}

echo "</table>";