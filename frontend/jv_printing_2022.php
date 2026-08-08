<?php
class ControllerTransactionJvPrinting2022 extends Controller
{
	private $error = array();
	public function index()
	{
		$this->load->language('transaction/amount_tran');

		$this->document->setTitle($this->language->get('heading_title'));


		if (isset($this->request->get['page'])) {
			$page = $this->request->get['page'];
		} else {
			$page = 1;
		}

		$url = '';

		if (isset($this->request->get['order'])) {
			$url .= '&order=' . $this->request->get['order'];
		}

		if (isset($this->request->get['page'])) {
			$url .= '&page=' . $this->request->get['page'];
		}

		$data['breadcrumbs'] = array();

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/dashboard', 'token=' . $this->session->data['token'], true)
		);

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('heading_title'),
			'href' => $this->url->link('report/jv_printing_2022', 'token=' . $this->session->data['token'] . $url, true)
		);

		if (isset($this->request->get['bank'])) {
			$data['bank'] = $this->request->get['bank'];
		} else {
			$data['bank'] = '';
		}

		if (isset($this->request->get['jv_no'])) {
			$jvno = $this->request->get['jv_no'];
		} else {
			$jvno = '';
		}

		$data['cancel'] = $this->url->link('transaction/payment_receipt', 'token=' . $this->session->data['token'], 'SSL');

		$data['dashboard'] = $this->url->link('common/dashboard', 'token=' . $this->session->data['token'], 'SSL');

		$data['action'] = $this->url->link('transaction/jv_printing_2022/edit', 'token=' . $this->session->data['token'] . '&jv_no=' . $jvno, $url, true);

		$data['print_html'] = $this->url->link('transaction/jv_printing_2022/print_html', 'token=' . $this->session->data['token'] . '&jv_no=' . $jvno, true);

		if (isset($this->error['warning'])) {
			$data['error_warning'] = $this->error['warning'];
		} else {
			$data['error_warning'] = '';
		}

		if (isset($this->session->data['success'])) {
			$data['success'] = $this->session->data['success'];

			unset($this->session->data['success']);
		} else {
			$data['success'] = '';
		}

		$data['heading_title'] = $this->language->get('heading_title');

		$data['text_list'] = $this->language->get('text_list');
		$data['text_no_results'] = $this->language->get('text_no_results');
		$data['text_confirm'] = $this->language->get('text_confirm');
		$data['text_all_status'] = $this->language->get('text_all_status');

		$data['column_date_start'] = $this->language->get('column_date_start');
		$data['column_date_end'] = $this->language->get('column_date_end');
		$data['column_orders'] = $this->language->get('column_orders');
		$data['column_products'] = $this->language->get('column_products');
		$data['column_tax'] = $this->language->get('column_tax');
		$data['column_total'] = $this->language->get('column_total');

		$data['token'] = $this->session->data['token'];

		$this->load->model('localisation/order_status');

		$data['order_statuses'] = $this->model_localisation_order_status->getOrderStatuses();

		$url = '';
		$data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');

		$data['payment_transaction'] = array();
		if (isset($this->request->get['jv_no'])) {
			$data['payment_transaction'] = $this->db->query("SELECT * FROM `payment_transaction_2023` WHERE jvno = '" . $this->request->get['jv_no'] . "'  AND transaction_type = 'JV' ORDER BY transaction_id ASC ")->rows;
			// echo '<pre>';
			// print_r($data['payment_transaction'] );
			// exit;
			// foreach ($payment_transaction as $pkey => $pvalue) {
			// $hsn_code = '';
			// $acc_datas = $this->db->query("SELECT hsn_code FROM oc_account WHERE shname = '".$pvalue['account_shname']."' ");
			// if ($acc_datas->num_rows > 0) {
			// 	$hsn_code = $acc_datas->row['hsn_code'];
			// }
			// $gst_per = 0;
			// $gst_datas = $this->db->query("SELECT gst_per FROM hsn_with_gst WHERE hsn_code = '".$hsn_code."' ");
			// if ($gst_datas->num_rows > 0) {
			// 	$gst_per = $gst_datas->row['gst_per'];
			// }
			// $gst_amount = 0;
			// if ($gst_per > 0 && $pvalue['debit'] > 0) {
			// 	$gst_amount = $pvalue['debit']*$gst_per/100;
			// } elseif ($gst_per > 0 && $pvalue['credit'] > 0) {
			// 	$gst_amount = $pvalue['credit']*$gst_per/100;
			// }


			// $data['payment_transaction'][] = array(
			// 	'account_shname'	=>	$pvalue['account_shname'],
			// 	'account_name'		=>	$pvalue['account_name'],
			// 	'debit'				=>	round($pvalue['debit'], 2),
			// 	'credit'			=>	round($pvalue['credit'], 2),
			// 	'jv_number'			=>	$pvalue['jv_number'],
			// 	'dot'				=>	$pvalue['dot'],
			// 	'gst_per'			=>	$pvalue['gst_per'],
			// 	'gst_amount'		=>	round($pvalue['credit'], 2),
			// );
			// }
		}
		$this->response->setOutput($this->load->view('transaction/jv_printing', $data));
	}

	public function print_html()
	{
		$user_id = $this->session->data['user_id'];
		$query = $this->db->query("SELECT username FROM `oc_user` WHERE user_id = " . (int)$user_id);
		$username = $query->row['username'];

		if (isset($this->request->get['jv_no'])) {
			$jv_data = $this->db->query("SELECT *, SUM(debit) as Debit FROM `payment_transaction_2023` WHERE jvno = '" . $this->request->get['jv_no'] . "' AND debit <> 0 GROUP BY jvno ")->row;
			$data['payment_transaction'] = $this->db->query("SELECT * FROM `payment_transaction_2023` WHERE jvno = '" . $this->request->get['jv_no'] . "'  AND transaction_type = 'JV' ORDER BY transaction_id ASC ")->rows;

			// foreach ($variable as $key => $value) {
			// 	// code...
			// }
			$data['address3'] = '';
			$data['address1'] = '';
			$data['address2'] = '';
			$data['jv_no'] = '';
			$jv_number = '';
			$data['receipt_date'] = '';
			$data['account_name'] = '';
			$data['account_shname'] = '';
			$data['debit_amt'] = '';
			$data['debit_amt_word'] = '';
			$data['narration'] = '';
			$data['username'] = $username;

			$account_no = preg_replace('/[^0-9]+/', '', $jv_data['account_shname']);

			$odebit_details = $this->db->query("SELECT address_1, address_3, state_1, pincode_1 FROM owners WHERE owner_code ='" . $account_no . "' ");
			// echo '<pre>';
			// print_r($odebit_details);
			// exit;
			if ($odebit_details->num_rows > 0) {
				$data['address1'] = $odebit_details->row['address_1'];
				$data['address2'] = $odebit_details->row['address_3'];
				$state_1 = $odebit_details->row['state_1'];
				if (isset($zones_data[$state_1]) && $state_1 > 0) {
					$data['address3'] = $zones_data[$state_1]['name'] . ' ' . $odebit_details->row['pincode_1'];
				}
			}

			$data['jv_no'] = $jv_data['jvno'];
			$jv_number = $jv_data['jv_number'];
			$data['receipt_date'] = $jv_data['dot'];
			$data['account_name'] = $jv_data['account_name'];
			$data['account_shname'] = $jv_data['account_shname'];
			$data['debit_amt'] = $jv_data['Debit'];
			$data['debit_amt_word'] = $this->getWordsMoney($jv_data['Debit']);
			$data['narration'] = $jv_data['narration'];
		}


		$data['base'] = HTTP_SERVER;
		$html = $this->load->view('transaction/jv_print_html', $data);
		// echo $html; exit;
		$filename = 'JV Print_' . $jv_number . '.html';
		header('Content-type: text/html');
		header('Content-Disposition: attachment; filename=' . $filename);
		echo $html;
		exit;
	}

	public function getWordsMoney($number)
	{

		$no = floor($number);
		$point = round($number - $no, 2) * 100;
		$hundred = null;
		$digits_1 = strlen($no);
		$i = 0;
		$str = array();
		$words = array(
			'0' => '',
			'1' => 'one',
			'2' => 'two',
			'3' => 'three',
			'4' => 'four',
			'5' => 'five',
			'6' => 'six',
			'7' => 'seven',
			'8' => 'eight',
			'9' => 'nine',
			'10' => 'ten',
			'11' => 'eleven',
			'12' => 'twelve',
			'13' => 'thirteen',
			'14' => 'fourteen',
			'15' => 'fifteen',
			'16' => 'sixteen',
			'17' => 'seventeen',
			'18' => 'eighteen',
			'19' => 'nineteen',
			'20' => 'twenty',
			'30' => 'thirty',
			'40' => 'forty',
			'50' => 'fifty',
			'60' => 'sixty',
			'70' => 'seventy',
			'80' => 'eighty',
			'90' => 'ninety'
		);
		$digits = array('', 'hundred', 'thousand', 'lakh', 'crore');
		while ($i < $digits_1) {
			$divider = ($i == 2) ? 10 : 100;
			$number = floor($no % $divider);
			$no = floor($no / $divider);
			$i += ($divider == 10) ? 1 : 2;
			if ($number) {
				$plural = (($counter = count($str)) && $number > 9) ? 's' : null;
				$hundred = ($counter == 1 && $str[0]) ? ' and ' : null;
				$str[] = ($number < 21) ? $words[$number] .
					" " . $digits[$counter] . $plural . " " . $hundred
					:
					$words[floor($number / 10) * 10]
					. " " . $words[$number % 10] . " "
					. $digits[$counter] . $plural . " " . $hundred;
			} else $str[] = null;
		}
		$str = array_reverse($str);
		$result = implode('', $str);

		return $result;
	}
}
