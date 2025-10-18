<?php
/**
 * COMENTÁRIO: Arquivo PHP para envio de e-mail do formulário de contato
 * COMENTÁRIO: Para alterar o e-mail de destino, modifique a variável $to abaixo
 * Utilizar o PHPMailer ou outra biblioteca é recomendado para produção
 */

// COMENTÁRIO: Configurações de segurança
header('Content-Type: application/json');
//header('Access-Control-Allow-Origin: https://seusite.com'); //modificar e colocar meu domínio
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// COMENTÁRIO: Permitir apenas origens específicas (substitua pelo seu domínio)
/*$allowed_origins = ['https://seusite.com'];
if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}*/


// Verifica se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// Lê os dados JSON do corpo da requisição
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// COMENTÁRIO: Validação básica dos dados
if (!isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados incompletos']);
    exit;
}

// Sanitiza os dados
$name = htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL); // OK manter assim
$phone = isset($data['phone']) ? htmlspecialchars(trim($data['phone']), ENT_QUOTES, 'UTF-8') : '';
$message = htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8');

// COMENTÁRIO: Alternativa de sanitização usando filter_var
//$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
//$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
//$phone = isset($data['phone']) ? filter_var($data['phone'], FILTER_SANITIZE_STRING) : '';
//$message = filter_var($data['message'], FILTER_SANITIZE_STRING);

// COMENTÁRIO: Validação de e-mail
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'E-mail inválido']);
    exit;
}

// COMENTÁRIO: Proteção contra spam - verifica se o e-mail contém palavras suspeitas
$spam_words = ['viagra', 'cialis', 'casino', 'lottery', 'prize'];
$message_lower = strtolower($message);
foreach ($spam_words as $word) {
    if (strpos($message_lower, $word) !== false) {
        http_response_code(400);
        echo json_encode(['error' => 'Mensagem identificada como spam']);
        exit;
    }
}

// COMENTÁRIO: Configurações do e-mail
// COMENTÁRIO: ALTERE O E-MAIL ABAIXO PARA O SEU E-MAIL DE DESTINO
$to = 'd.conde22@gmail.com';
$subject = 'Novo contato do site - Marketing Digital Pro';

// Monta o corpo do e-mail
$email_body = "Você recebeu uma nova mensagem do formulário de contato do site.\n\n";
$email_body .= "Nome: $name\n";
$email_body .= "E-mail: $email\n";
if (!empty($phone)) {
    $email_body .= "Telefone: $phone\n";
}
$email_body .= "\nMensagem:\n$message\n";

// Cabeçalhos do e-mail
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// COMENTÁRIO: Envia o e-mail
if (mail($to, $subject, $email_body, $headers)) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'E-mail enviado com sucesso']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao enviar e-mail']);
}
?>

