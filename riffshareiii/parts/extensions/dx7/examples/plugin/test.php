<?php
$signpem = <<<EOD
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDmFLH8B8p7xnBggpOyvqhu0sgb/xQY8O7jBWl0NXIuvKOB5Fc0+J8kKVAYDgiUf7YH75iISv9c85NwlQjLoFJd+rNZc0AqLE8t6rkTiqv/QjpqHfow+ZTywLdny6klprSUT4fEOo9qNiVbOxlPA6QI8uSakMpEXQYG5euUCEh09oVu3hgcv1Z+ZJ/QYANTgPjIPUQh0oLtejdLmQH2VejCpsZDBKxSI/r8KTta2pVFgvcEbvVdrNV4doIvCNqpBvuu17zI3friuv3SX4p7+PanJ/d2HpO3L25Xh0ilBJUIH1HbPK73AmGyjWRL5Pg3zGBwnFfy1n1+dvWo6qosGAOhAgMBAAECggEAAdJLycHVXbR8+EP1tQu4W/mUNvsxJrS67MDYDGD4m0ZytEO2rbHYL1pFCuO1jVi+Jq2ZaLQl9bpB7Q6+UpUILJFLBobDN8eWWuKJqONx/XkslYwmNRQMv1KSQSKbdLOvU0tBORGjnVokt+ZYYB1DGQUJ6pqsge0LRVZgTpGK4qN7I/5c3Cd+McjUGhga+wonDDbNfcF+KagOHafFkpZG0hgf7608hXHw/N0Jmw7+HA9/VD+a40Kl2WK4+2wGXfwRYoGueibFyXAbjJh/k5BfeDuBmL9x/suNsi503jms/Onue2IkA0xR8qkCwwhJuXJ2J9Qmp2lnKGOdx+g7RdlR3wKBgQD33GvcDSZQb/6FBgUmM2L9ubZqPcAvU5vuqc2vqNhRgHBkvZnr+TiWlZG5//71QfQC5SexeU953inPlkwC7Peyb1bQmw/3RlTZ+GKytnv+9g16U2kNJnW2F/bYjgGChREaN3OZanbJ+7CmNa1UKxE3olWeUUx1YvwNjm+IgPHg6wKBgQDtos87uT2R4nk9SQ9qqfX4ksDj+h5fiKffrXHmpLwitkYnuaI+vIaFo1oCFrfaC8+6RXfhr8xngqmbasOwqvyZzWjq8g+BFMMSpWpg0+eHTkSYehrid/LLtFiTR4JuvH7uio+SAH92/oKRfmKwGsiteSzpYQnKspOTY5Uch73qowKBgQDOpQ+ry67I20Z4wzchzS/X17B0zPzguDVF+n3I2N1Yvdt2sfiVGxgJu7NePkbjVVRJ4aGBPmF7ejSjpGvE+KneMyNPEihygUmW3JX0511jiOJdvRLVat4yrbIYg/RQS/6hO9/95Rwac+On/xJ+HNXi6020i5VSPO9lof3s8Yw3dwKBgF4Fjszoi+3Ol32iDJF9Ua7aEauh6KaP4Svk6i4Be9aYG8XX8tOzr93sNc6hwnhpN/VRSw9miQ9jaUvuwCKEZJFN7ncW8v91gYE9JYvOC8tDMmzJ0x1LrCrg3jLXlknOFsK22/s+azBfnrWGNfHLhx7r1NM566/hW/Zy7iptorzVAoGAHSFygkdzboY7a/QDFu09auV3DVbJFMiktMM9il9MsSAgjYNFLJJe7oAwXgQI7s/v1hR86tr43gKKugyacAodyGwmSkwdXxJqk1R6UcQJB1yxqA4t7OksLlPGbw0gvID/lz/UE5ikcw2arLWwjS3AcGfRc703PeqxGr8EUeTN+2A=
-----END PRIVATE KEY-----
EOD;
/*
$verifypem = <<<EOD
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4Mvn3hgJG1FAqloZSsSswDHN4RHO24QO9cRb0OSt0yDYD6YxcdMQC2D5XGQR6h1kyvIcbCcE7ltm+oo6vXPYCX4tqZq37QpMWNqKn2ps1sAChEX9JM7KNvMH7s6mK6Hi4Fb1rAKaAKnxgyxz64BQmYCTV6+BbTfDPB7pL+JpgUY5Ntl4e+B0/NDmfF5jQO63HGhO4FDexFkv1fp2pYt6EgIq+68AoV/iGUrTouUcoeJLikTmEnu0Fc6NUHRFCI591eMKmDSdHBHhSHHSdsc+lfHGH9Sw1LcgSnMzxFbjaZpOnuRa5RrfSgtLM6HVpcDTS6+3P6jqyDRhnwkqjCY0dQIDAQAB
-----END PUBLIC KEY-----
EOD;
$signatureline = 'PP+Dr87qQgGzDe0v0Yda3BmttTBykjezqc+q2F0neCXyYUXLShrqoemLFSv7kwE43BQpJ09b7adrE+vR9JAP8WNnIBD2DmU+QiChxEyV7AwoaoPB+dCXCTsWfjqdHCyHbWfb++79ufaIb6IOE/4ZKXWAF88Cv/a1VSG6dKGsAGwUTssbtQobeOa6a2DG7i/0Ln53u8nOFphv2rnGQp8b/kBPdDk1RFuzpCwTNPh9wqKlNIdt1A8QX9MszDZfZUFp4G9MGPhBfszt90GqMIpmGsP0HofeXXDrHXSAJbOemk6nSjKH0t0SdbBNkZR7iT8/V7Y9IhgveXgd9u9cxaufqw==';
//                PP+Dr87qQgGzDe0v0Yda3BmttTBykjezqc+q2F0neCXyYUXLShrqoemLFSv7kwE43BQpJ09b7adrE+vR9JAP8WNnIBD2DmU+QiChxEyV7AwoaoPB+dCXCTsWfjqdHCyHbWfb++79ufaIb6IOE/4ZKXWAF88Cv/a1VSG6dKGsAGwUTssbtQobeOa6a2DG7i/0Ln53u8nOFphv2rnGQp8b/kBPdDk1RFuzpCwTNPh9wqKlNIdt1A8QX9MszDZfZUFp4G9MGPhBfszt90GqMIpmGsP0HofeXXDrHXSAJbOemk6nSjKH0t0SdbBNkZR7iT8/V7Y9IhgveXgd9u9cxaufqw==
*/
$data = 'Test message to for testing.';
echo $data;
echo "\n";

$phpSignature = "";
$success = openssl_sign($data, $phpSignature, $signpem, OPENSSL_ALGO_SHA256);
if (!$success) {
    throw new Exception("Signing failed: " . openssl_error_string());
}
$transportableSignature = base64_encode($phpSignature);
echo "Signature: " . $transportableSignature;
echo "\n-------------------------\n";

////////////////////////////////////
/*
//$importSignature = base64_decode($transportableSignature);
$importSignature = base64_decode($signatureline);

$result = openssl_verify($data, $importSignature, $verifypem, OPENSSL_ALGO_SHA256);

if ($result === 1) {
	echo "Success: The data is authentic and intact.";
} elseif ($result === 0) {
	echo "Failed: Data tampered with or signature invalid.";
} else {
	echo "Error checking signature: " . openssl_error_string();
}

*/
